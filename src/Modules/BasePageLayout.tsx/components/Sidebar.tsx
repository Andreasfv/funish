import styled from "styled-components";
import { useAdmin } from "../../../utils/admin/useAdmin";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 200px;
  background-color: ${(props) => props.theme.colors.lightGreen};
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

const SidebarBottomItem = styled(SidebarItem)`
  justify-self: flex-end;
`;

const SidebarBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
`;

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const admin = useAdmin();
  return (
    <Wrapper>
      <SidebarItem>Dashboard</SidebarItem>
      <SidebarItem>Punish</SidebarItem>
      {admin && <SidebarItem>Admin</SidebarItem>}
      {admin && <SidebarItem>Manage Organization</SidebarItem>}
      <SidebarBottomWrapper>
        <SidebarItem>My Account</SidebarItem>
        <SidebarItem>Logout</SidebarItem>
      </SidebarBottomWrapper>
    </Wrapper>
  );
};

export default Sidebar;
