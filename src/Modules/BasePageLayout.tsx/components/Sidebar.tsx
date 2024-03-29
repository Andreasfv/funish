import { useRouter } from "next/router";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { signOut } from "next-auth/react";
import { useAdmin } from "../../../utils/admin/useAdmin";

const Wrapper = styled.div`
  position: sticky;
  top: 4rem;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 200px;
  height: calc(100vh - 4rem);
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

const OrgContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
`;
const Sidebar: React.FC = () => {
  const router = useRouter();
  const { data: me } = api.users.me.useQuery();
  const isAdmin = useAdmin();
  function goTo(path: string) {
    if (!me?.data?.user?.organizationId) return;

    return () => {
      router
        .push({
          pathname: `/[organizationId]/${path}`,
          query: { organizationId: me?.data?.user?.organizationId },
        })
        .catch((err) => console.warn(err));
    };
  }

  return (
    <Wrapper>
      <SidebarItem onClick={goTo("dashboard")}>Dashboard</SidebarItem>
      <SidebarItem onClick={goTo("punishment/punish")}>Meld SP!</SidebarItem>
      <SidebarItem onClick={goTo("my-punishments")}>Mine SP</SidebarItem>
      <OrgContentWrapper>
        <SidebarItem onClick={goTo("all-users-punishments")}>
          SP Oversikt
        </SidebarItem>
        <SidebarItem onClick={goTo("gallery")}>Galleri</SidebarItem>

        <SidebarItem onClick={goTo("multi-sp-tool")}>
          Multi SP verktøy
        </SidebarItem>
      </OrgContentWrapper>
      <SidebarBottomWrapper>
        {isAdmin && (
          <SidebarItem onClick={goTo("manage-organization")}>
            Gjeng Instillinger{" "}
          </SidebarItem>
        )}
        <SidebarItem onClick={goTo("my-account")}>Min Konto</SidebarItem>
        <SidebarItem
          onClick={() => {
            void signOut({
              callbackUrl: `${window.location.origin}`,
            });
          }}
        >
          Logout
        </SidebarItem>
      </SidebarBottomWrapper>
    </Wrapper>
  );
};

export default Sidebar;
