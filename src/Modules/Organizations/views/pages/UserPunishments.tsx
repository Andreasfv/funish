import { zodResolver } from "@hookform/resolvers/zod";
import type { Punishment, PunishmentType, PunishmentReason } from "@prisma/client";
import type { User } from "next-auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { z } from "zod";
import FormButton from "../../../../components/input/formButton";
import FormNumberInput from "../../../../components/input/formNumberInput";
import FormSelect from "../../../../components/input/formSelect";
import { useAdmin } from "../../../../utils/admin/useAdmin";
import { api } from "../../../../utils/api";
import { useMediaQuery } from "../../../../utils/media/useMedia";
import theme from "../../../../utils/theme";
import { BasePageLayout } from "../../../BasePageLayout.tsx/BasePageLayout";
import FormField from "../../../Punishment/components/FormField";
import PunishmentRow from "../../components/PunishmentRow";

const Wrapper = styled.div`
    display: flex;
    flex-direction:column;
    gap: 1rem;
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

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    padding: 1rem;
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

const RedemptionTitle = styled.div`
    display: flex;
    width: 100%;
    font-weight: 600;
    font-size: 1.2rem;
    justify-content: center;
    align-items: center;
`
const redeemFormSchema = z.object({
    type: z.string(),
    typeString: z.string(),
    quantity: z.number().min(1)
})

type redeemFormType = z.infer<typeof redeemFormSchema>

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

    const { handleSubmit, setValue, register, watch, } = useForm<redeemFormType>({
        resolver: zodResolver(redeemFormSchema),
    })

    function handleChange(formKey: keyof redeemFormType) {
        return (value: redeemFormType[typeof formKey]) => {
          setValue(formKey, value);
        };
      }

    const {userId, organizationId} = router.query
    const {data, refetch, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } = api.punishments.getPunishments.useInfiniteQuery({
        userId: userId as string,
        organizationId: organizationId as string,
        limit: 15,
        redeemed: false,
        including: {
            createdBy: true,
            type: true,
            reason: true,
            user: true
        }
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const { data: punishmentTypes } = api.punishmentTypes.getPunishmentTypes.useQuery(
        { organizationId: organizationId as string},
        {
            enabled: !!organizationId && isAdmin
        }
        )

    const {mutate: updatePunishmentMutation} = api.punishments.updatePunishment.useMutation()
    const {mutate: deletePunishmentMutation} = api.punishments.deletePunishment.useMutation()
    const {mutate: redeemPunishmentsMutation } = api.punishmentTypes.redeemPunishments.useMutation({
        onSuccess: () => {
            toast("Punishments redeemed! WOP", {
                type: "success",
                position: "bottom-center"
            })
        },
        onError: () => {
            toast("Failed to redeem punishments", {
                type: "error",
                position: "bottom-center"
            })
        }
    })

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

    const redeemPunisments = (data: redeemFormType) => {
        const input = {
            punishmentTypeId: data.type,
            quantity: data.quantity,
            userId: userId as string,
            organizationId: organizationId as string
        }
        console.log(input)
        redeemPunishmentsMutation(input, {
            onSuccess: () => {
                void refetch()
            }
        })
    }

    function redeemFormSubmit(){
        console.log()
        handleSubmit(redeemPunisments)()
        
        .catch(() => {
            toast(
                "Failed to redeem punishments",
                {
                    type: "error",
                    position: "bottom-center"
                }
            )
        })
    } 

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
    const typeOptions: {
        value: string;
        label: string;
    }[] = useMemo(() => {
        if (!punishmentTypes) return []
        return punishmentTypes?.data?.punishmentTypes.map((type) => {
            return {
                value: type.id,
                label: type.name
            }
        })
    }, [punishmentTypes])

    return (
        <BasePageLayout>
            <Wrapper>
                {isAdmin && <ContentWrapper>
                    <FormWrapper>
                        <RedemptionTitle>Redeem Punishments</RedemptionTitle>
                        <FormField>
                            <label>Punishment Type</label>
                            <FormSelect 
                                text={watch("typeString") ?? ""} 
                                options={typeOptions} 
                                handleChange={handleChange("type")} 
                                handleTextChange={handleChange("typeString")} /> 
                        </FormField>
                        <FormField>
                            <label>Quantity</label>
                            <FormNumberInput register={register("quantity", {
                                valueAsNumber: true,
                            })}  />
                        </FormField>
                        <FormField>
                            <FormButton onClick={redeemFormSubmit}>Redeem</FormButton>
                        </FormField>
                    </FormWrapper>
                </ContentWrapper>}
                <ContentWrapper onScroll={handleScroll}>
                    <HeaderRow>
                        {!mobile ? (
                            <>
                                <div>Type</div>
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