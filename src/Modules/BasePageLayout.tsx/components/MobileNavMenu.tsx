import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";

interface WrapperProps {
  open: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  position: fixed;
  display: flex;
  top: 4rem;
  width: 100%;
  height: ${(props) => (props.open ? "calc(100% - 4rem)" : "0%")};
  transition: height 0.5s ease-in-out;
  background: white;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  clip-path: inset(0px 0px -10px 0px);
`;

interface ContentWrapperProps {
  open: boolean;
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1rem 1rem 1rem 1rem;

  transition: visibility 0s;
  transition-delay: 0.5s;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  clip-path: inset(0px 0px -10px 0px);
  overflow: hidden;
`;

const BottomContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: auto;
`;

const MenuLink = styled(Link)`
  display: flex;
  height: 3rem;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.green};
  margin-bottom: 0.6rem;
  border-radius: 0.3rem;
  align-items: center;
  :hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.lightGreen};
  }
  :focus {
    background: ${(props) => props.theme.colors.lightGreen};
  }
  :active {
    background: ${(props) => props.theme.colors.lightGreen};
  }
`;

type Route = {
  name: string;
  path: string;
};

interface MobileNavMenuProps {
  toggleNavMenu: () => void;
  clickRef: React.RefObject<HTMLDivElement>;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  toggleNavMenu,
  clickRef,
}) => {
  const [opened, setOpened] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bottomRoutes, setBottomRoutes] = useState<Route[]>([]);
  const router = useRouter();
  const { data: me } = api.users.me.useQuery();

  function handleLogout() {
    void signOut({
      callbackUrl: `${window.location.origin}`,
    });
  }

  // Handle CLICK outside of the nav menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        clickRef.current &&
        !clickRef.current.contains(event.target as Node)
      ) {
        toggleNavMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    setOpened(true);
    return () => {
      setOpened(false);
    };
  }, []);

  useEffect(() => {
    if (me?.data?.user?.organizationId) {
      const orgId = me?.data?.user?.organizationId;
      const routes = [
        {
          name: "Dashboard",
          path: `/${orgId}/dashboard`,
        },
        {
          name: "Meld SP!",
          path: `/${orgId}/punishment/punish`,
        },
        {
          name: "Mine SP",
          path: `/${orgId}/my-punishments`,
        },
        {
          name: "SP Oversikt",
          path: `/${orgId}/all-users-punishments`,
        },
      ];
      setRoutes([...routes]);
      setBottomRoutes([
        {
          name: "Min Bruker",
          path: `/${orgId}/my-account`,
        },
      ]);
    } else {
      setRoutes([]);
    }
  }, [me]);

  const links = routes.map((route, index) => (
    <MenuLink key={index} href={route.path}>
      {route.name}
    </MenuLink>
  ));
  const bottomLinks = bottomRoutes.map((route, index) => (
    <MenuLink key={links.length + index} href={route.path}>
      {route.name}
    </MenuLink>
  ));

  return (
    <Wrapper open={opened}>
      <ContentWrapper open={opened}>
        {links}
        <BottomContentWrapper>
          {bottomLinks}
          <MenuLink href="/" onClick={handleLogout}>
            Logout
          </MenuLink>
        </BottomContentWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default MobileNavMenu;
