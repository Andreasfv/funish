import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { BasePageLayout } from "../../Modules/BasePageLayout.tsx/BasePageLayout";
import OrganizationPaper from "../../Modules/Organizations/OrganizationPaper";
import { AdminDashboardPanel } from "../../Modules/Punishment/AdminDashboardPanel";
import PunishmentCard from "../../Modules/Punishment/PunishmentCard";
import { useAdmin } from "../../utils/admin/useAdmin";
import { api } from "../../utils/api";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1200px;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PunishmentCardsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
  justify-content: flex-start;
`;

const Dashboard: NextPage = () => {
  const { t } = useTranslation();
  const session = useSession();
  const admin = useAdmin();
  const { data: userData, isLoading: userDataLoading } =
    api.users.getComprehensiveUserData.useQuery(session?.data?.user?.id ?? "");

  console.log(userData);

  if (userDataLoading) {
    return <>Loading...</>;
  }

  if (userData?.data?.user?.organization) {
    return (
      <BasePageLayout>
        <Wrapper>
          <ContentWrapper>
            <Title>
              {t("dashboard.title", {
                orgName: userData?.data?.user?.organization?.name,
              })}
            </Title>
            <PunishmentCardsWrapper>
              {userData.data?.user?.organizationId &&
                userData?.data?.user?.organization?.punishmentTypes?.map(
                  (punishmentType) => (
                    <PunishmentCard
                      punishmentType={punishmentType.name}
                      count={punishmentType.Punishments.length}
                    />
                  )
                )}
            </PunishmentCardsWrapper>
            {admin && <AdminDashboardPanel />}
            Organization:
            {userData.data?.user?.organizationId && (
              <OrganizationPaper
                organizationId={userData.data.user.organizationId}
                userId={userData.data.user.id}
              />
            )}
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    );
  }

  return <>Whoopsie, something went wrong</>;
};
export default Dashboard;
