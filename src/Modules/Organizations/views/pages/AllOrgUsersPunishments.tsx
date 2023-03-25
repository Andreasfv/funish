import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { api } from "../../../../utils/api";
import { BasePageLayout } from "../../../BasePageLayout.tsx/BasePageLayout";
import UserPunishmentsRow from "../../components/UserPunishmentsRow";


const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    padding: 1rem;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const TableHeader = styled.div`
    display: flex;
    width: 100%;
    height: 3rem;
    background-color: ${(props) => props.theme.colors.lightDarkGreen};
    border-radius: 0.5rem;
    padding: 0.5rem;
    div {
        flex: 1;
        display: flex;
        align-items: center;
        font-weight: 600;
    }
`

const AllOrgUsersPunishments: React.FC = () => {
    const session = useSession()
    const router = useRouter()
    const organizationId = session.data?.user.organizationId
    const { data: organization } = api.organizations.getOrganizationUsersWithPunishmentData.useQuery(organizationId ?? "", {
        enabled: !!organizationId,
    })



    function goToUserPunishments(userId: string) {
        return () => {
            if (!organizationId || !userId) return
            router.push(`/[organizationId]/user-punishments/[userId]`, `/${organizationId}/user-punishments/${userId}`).catch((err) => console.warn(err))
        }
    }
    const userCards = organization?.data?.organization?.users.map((user, index) => {
        return (
            <UserPunishmentsRow key={index} user={user} onClick={goToUserPunishments(user.id)}/>
        )
    })
    return (
        <BasePageLayout>
            <Wrapper>
                <ContentWrapper>
                    <TableHeader>
                        <div>Username</div>
                        <div>Approved</div>
                        <div>Unapproved</div>
                    </TableHeader>
                    {userCards}
                </ContentWrapper>
            </Wrapper>
        </BasePageLayout>
    );
};

export default AllOrgUsersPunishments;
