import { useRouter } from "next/router";
import styled from "styled-components";
import { useAdmin } from "../../../utils/admin/useAdmin";
import { api } from "../../../utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

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
  const router = useRouter();
  const { data: me } = api.users.me.useQuery();

  function goTo(path: string) {
    if (!me?.data?.user?.organizationId) return;

    return () => {
      router.push({
        pathname: `/[organizationId]/${path}`,
        query: { organizationId: me?.data?.user?.organizationId },
      });
    };
  }

  return (
    <Wrapper>
      <SidebarItem onClick={goTo("dashboard")}>Dashboard</SidebarItem>
      <SidebarItem onClick={goTo("punishment/punish")}>Punish</SidebarItem>
      <SidebarItem onClick={goTo("my-punishments")}>My Punishments</SidebarItem>
      <SidebarBottomWrapper>
        <SidebarItem>My Account</SidebarItem>
        <SidebarItem
          onClick={() => {
            router.push("/");
            void signOut();
          }}
        >
          Logout
        </SidebarItem>
      </SidebarBottomWrapper>
    </Wrapper>
  );
};

export default Sidebar;
