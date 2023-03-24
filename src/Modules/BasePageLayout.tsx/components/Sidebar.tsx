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

const SidebarBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
`;

const Sidebar: React.FC = () => {
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
