import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { BasePageLayout } from "../../Modules/BasePageLayout.tsx/BasePageLayout";
import OrganizationPaper from "../../Modules/Organizations/OrganizationPaper";
import PunishmentCard from "../../Modules/Punishment/PunishmentCard";
import { useAdmin } from "../../utils/admin/useAdmin";
import { api } from "../../utils/api";
import { useDevices } from "../../utils/media/useMedia";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 1rem;
`;

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  height: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 1rem;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  background-color: ${(props) => props.theme.colors.lightGreen};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
`;

const LogWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 200px;
  gap: 1rem;
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  background-color: ${(props) => props.theme.colors.lightGreen};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
`;
interface DashboardProps {
  userId: string;
}

const Dashboard: NextPage = () => {
  const { t } = useTranslation();
  const session = useSession();
  const admin = useAdmin();
  const router = useRouter();
  const [mobile] = useDevices();
  const inspecting = router.pathname !== "/dashboard";

  const { userId } = router.query;
  const { data: userData, isLoading: userDataLoading } =
    api.users.getComprehensiveUserData.useQuery(
      typeof userId == "string" ? userId : session?.data?.user?.id ?? ""
    );

  if (userDataLoading) {
    return <>Loading...</>;
  }

  if (userData?.data?.user?.organization) {
    return (
      <BasePageLayout>
        <Wrapper>
          <ContentWrapper>
            <InnerWrapper>
              <ContentWrapper>
                {!inspecting && (
                  <CardsWrapper>### ACTIONS TODO ###</CardsWrapper>
                )}
                <CardsWrapper>
                  {userData.data?.user?.organizationId &&
                    userData?.data?.user?.organization?.punishmentTypes?.map(
                      (punishmentType) => (
                        <PunishmentCard
                          punishmentType={punishmentType.name}
                          count={punishmentType.Punishments.length}
                        />
                      )
                    )}
                </CardsWrapper>
                {userData.data?.user?.organizationId && (
                  <CardsWrapper>
                    <OrganizationPaper
                      organizationId={userData.data.user.organizationId}
                      userId={userData.data.user.id}
                    />
                  </CardsWrapper>
                )}
              </ContentWrapper>
              <LogWrapper>###Event Log###</LogWrapper>
            </InnerWrapper>
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    );
  }

  return <BasePageLayout>Whoopsie, something went wrong</BasePageLayout>;
};

export default Dashboard;
