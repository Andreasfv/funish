import { useRouter } from "next/router";
import styled from "styled-components";
import { useAdmin } from "../../utils/admin/useAdmin";
import { BasePageLayout } from "../BasePageLayout.tsx/BasePageLayout";
import CreatePunishment from "./CreatePunishment";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  flex-direction: column;
`;

const TopContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 1rem 1rem 0rem 1rem;
`;

const SwitchWrapper = styled.div`
  display: flex;
  width: 100%;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
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
  padding: 1rem;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
    cursor: pointer;
  }
`;

const BottomContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0rem 1rem 1rem 1rem;
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

  function goToSwitchItem(item: string) {
    const route = router.asPath;
    const routeArray = route.split("/");
    const goToRoute = `${routeArray
      .slice(0, routeArray.length - 1)
      .join("/")}/${item}`;
    router.push(goToRoute).catch((err) => console.log(err));
  }
  const switchItems = [
    { label: "Punish", href: "punish" },
    { label: "Manage Punishment Types", href: "manage_punishment_types" },
    { label: "Manage Punishment Reasons", href: "manage_punishment_reasons" },
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
    <SwitchItem selected={false}>Punish</SwitchItem>
  );

  return (
    <>
      <BasePageLayout>
        <Wrapper>
          <TopContentWrapper>
            <SwitchWrapper>{SwitchItems}</SwitchWrapper>
          </TopContentWrapper>
          <BottomContentWrapper>
            <DashboardWrapper>
              <CreatePunishment />
            </DashboardWrapper>
          </BottomContentWrapper>
        </Wrapper>
      </BasePageLayout>
    </>
  );
};

export default PunishmentDashboard;
