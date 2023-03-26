import type { Punishment, PunishmentType, PunishmentReason } from "@prisma/client";
import type { User } from "next-auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useAdmin } from "../../../../utils/admin/useAdmin";
import { api } from "../../../../utils/api";
import { useMediaQuery } from "../../../../utils/media/useMedia";
import theme from "../../../../utils/theme";
import { BasePageLayout } from "../../../BasePageLayout.tsx/BasePageLayout";
import PunishmentRow from "../../components/PunishmentRow";

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    padding: 1rem;
`

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem;
    overflow-y: auto;
    background-color: ${(props) => props.theme.colors.lightGreen};
    gap: 0.4rem;
    max-height: 600px;
    border-radius: 0.5rem;
`

const HeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height. 2.5rem;
    background-color: ${(props) => props.theme.colors.darkGreen};
    padding: 0.5rem;
    border-radius: 0.5rem;
    div {
        display: flex;
        flex: 1;
        align-items: center;
    }
    & > :last-child {
        min-width: 175px;
        @media ${theme.media.largeMobile} {
            min-width: 80px;
            max-width: 90px;
        }
    }
`
interface UserPunishmentsProps {
    user: User & {
        punishments: (Punishment & {
            type: PunishmentType;
            reason: PunishmentReason;
        })[];
    }
}
const UserPunishments: React.FC<UserPunishmentsProps> = () => {
    const isAdmin = useAdmin()
    const router = useRouter()
    const mobile = useMediaQuery(theme.media.largeMobile)
    const [punishmentRows, setPunishmentRows] = useState<JSX.Element[]>([])

    const {userId, organizationId} = router.query
    const {data, refetch, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } = api.punishments.getPunishments.useInfiniteQuery({
        userId: userId as string,
        organizationId: organizationId as string,
        limit: 15,
        including: {
            createdBy: true,
            type: true,
            reason: true,
            user: true
        }
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const {mutate: updatePunishmentMutation} = api.punishments.updatePunishment.useMutation()
    const {mutate: deletePunishmentMutation} = api.punishments.deletePunishment.useMutation()


    const approvePunishment = useCallback((id: string) => {
        return () => {
            updatePunishmentMutation({id: id, approved: true}, {
                onSuccess: () => {
                    void refetch()
                }
            })
        }
    }, [refetch, updatePunishmentMutation])


    const deletePunishment = useCallback((id: string) => {
        return () => {
            deletePunishmentMutation(id, {
                onSuccess: () => {
                    void refetch()
                }
            })
        }
    }, [deletePunishmentMutation, refetch])

    const createRows = useCallback(() => {
        if (!data ) return
        const punishmentRows = data.pages.map((page) => {
            return page.punishment.map((punishment) => {
                return (
                    <PunishmentRow
                        key = {punishment.id}
                        punishment = {punishment}
                        approvePunishment = {approvePunishment(punishment.id)}
                        deletePunishment = {deletePunishment(punishment.id)}
                    />
                )
            })
        }).flat()
        setPunishmentRows(punishmentRows)
    }, [approvePunishment, data, deletePunishment])

    function doFetchNextPage() {
        console.log("fetchin!")
        console.log(hasNextPage)
        fetchNextPage()
        .then(() => {
            createRows()
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        createRows()
        return () => {
            setPunishmentRows([])
        }
    }, [createRows, data])

    function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
        // start fetching when the user gets close to the bottom of the scrollable area
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 100) {
            if (isLoading || isFetchingNextPage || !hasNextPage) return
            doFetchNextPage()
        }
    }

    return (
        <BasePageLayout>
            <Wrapper>
                <ContentWrapper onScroll={handleScroll}>
                    <HeaderRow>
                        {!mobile ? (
                            <>
                                <div>Type</div> {punishmentRows.length}
                                <div>Reason</div>
                                <div>From</div>
                                <div>Approved</div>
                                <div></div>
                            </>
                            ) : (
                                <>
                                    <div>Punishments</div>
                                </>
                            )
                        }
                    </HeaderRow>
                    {punishmentRows}
                </ContentWrapper>
            </Wrapper>
        </BasePageLayout>
    )
}    

export default UserPunishments