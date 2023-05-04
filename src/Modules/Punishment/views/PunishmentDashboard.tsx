import { useRouter } from "next/router";
import styled from "styled-components";
import { useAdmin } from "../../../utils/admin/useAdmin";
import { api } from "../../../utils/api";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import CreatePunishment from "./subviews/CreatePunishment";
import ManagePunishmentReasons from "./subviews/ManagePunishmenReasons";
import ManagePunishmentTypes from "./subviews/ManagePunishmentTypes";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  box-shadow: ${(props) => props.theme.shadow.wrapperShadow};
  margin: 1rem;
  border-radius: 0.5rem;
  overflow-y: auto;

  @media ${(props) => props.theme.media.largeMobile} {
    margin: 0rem;
    border-radius: 0rem;
  }
`;

const TopContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const SwitchWrapper = styled.div`
  display: flex;
  width: 100%;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  @media ${(props) => props.theme.media.largeMobile} {
    border-radius: 0rem;
    padding-bottom: 0rem;

    & > div:last-child {
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    & > div:first-child {
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }
  }
`;
interface SwitchItem {
  selected: boolean;
}
const SwitchItem = styled.div<SwitchItem>`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.selected ? props.theme.colors.darkGreen : props.theme.colors.green};
  margin: 0rem 0.5rem;
  padding: 0.3rem;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
    cursor: pointer;
  }

  @media ${(props) => props.theme.media.largeMobile} {
    border-radius: 0;
    padding: 0.2rem;
    margin: 0rem;
  }
`;

const BottomContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.lightGreen};
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem;
`;

const PunishmentDashboard: React.FC = () => {
  const isAdmin = useAdmin();
  const router = useRouter();
  const switchItem =
    router.pathname.split("/")[router.pathname.split("/").length - 1] ?? "";
  const { organizationId } = router.query;
  function goToSwitchItem(item: string) {
    const route = router.asPath;
    const routeArray = route.split("/");
    const goToRoute = `${routeArray
      .slice(0, routeArray.length - 1)
      .join("/")}/${item}`;
    router.push(goToRoute).catch((err) => console.warn(err));
  }

  const { data: organization, refetch } =
    api.organizations.getOrganizationWithPunishmentData.useQuery(
      {
        organizationId: organizationId as string,
      },
      { enabled: !!organizationId }
    );
  const switchItems = [
    { label: "Meld", href: "punish" },
    { label: "Typer", href: "manage_punishment_types" },
    { label: "Grunnlag", href: "manage_punishment_reasons" },
  ];

  const SwitchItems = isAdmin ? (
    switchItems.map((item, index) => (
      <SwitchItem
        key={index}
        selected={switchItem === item.href}
        onClick={() => goToSwitchItem(item.href)}
      >
        {item.label}
      </SwitchItem>
    ))
  ) : (
    <SwitchItem selected={false}>Meld</SwitchItem>
  );

  function execRefetch() {
    void refetch();
  }

  function contentSwitch(str: string) {
    switch (str) {
      case "punish":
        return <CreatePunishment />;
      case "manage_punishment_types":
        return (
          <ManagePunishmentTypes
            punishmentTypes={
              organization?.data.organization?.punishmentTypes ?? []
            }
            refetch={execRefetch}
          />
        );
      case "manage_punishment_reasons":
        return (
          <ManagePunishmentReasons
            refetch={execRefetch}
            punishmentReasons={
              organization?.data.organization?.punishmentReasons ?? []
            }
          />
        );
      default:
        return <CreatePunishment />;
    }
  }

  return (
    <>
      <BasePageLayout>
        <Wrapper>
          <ContentWrapper>
            <TopContentWrapper>
              <SwitchWrapper>{SwitchItems}</SwitchWrapper>
            </TopContentWrapper>
            <BottomContentWrapper>
              <DashboardWrapper>{contentSwitch(switchItem)}</DashboardWrapper>
            </BottomContentWrapper>
          </ContentWrapper>
        </Wrapper>
      </BasePageLayout>
    </>
  );
};

export default PunishmentDashboard;
