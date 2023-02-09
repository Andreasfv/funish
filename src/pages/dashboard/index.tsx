import { Divider } from "antd";
import { NextPage } from "next";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { BasePageLayout } from "../../Modules/BasePageLayout.tsx/BasePageLayout";
import { AdminDashboardPanel } from "../../Modules/Punishment/AdminDashboardPanel";
import { api } from "../../utils/api";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#108ee9",
};

const Dashboard: NextPage = () => {
  const { t } = useTranslation();
  const { data: myOrg, isLoading: myOrgLoading } =
    api.organizations.getMyOrganization.useQuery();
  const { data: me, isLoading: meLoading } = api.users.me.useQuery();

  const isAdmin =
    me?.data.user?.role === "SUPER_ADMIN" ||
    me?.data.user?.role === "ORG_ADMIN";

  if (myOrgLoading || meLoading) {
    return <>Loading...</>;
  }

  if (myOrg?.data.organization && me?.data.user) {
    return (
      <BasePageLayout
        breadcrumbItems={[
          { label: "Organizations", href: "organizations" },
          { label: "Dashboard", href: "dashboard" },
        ]}
      >
        <Wrapper>
          <ContentWrapper>
            <Title>
              {t("dashboard.title", {
                orgName: myOrg.data.organization.name,
              })}
            </Title>
            <Divider />
            {isAdmin && <AdminDashboardPanel />}
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    );
  }

  return <>Whoopsie, something went wrong</>;
};
export default Dashboard;
