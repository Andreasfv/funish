import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import styled from "styled-components";
import { useMediaQuery } from "../../../utils/media/useMedia";
import theme from "../../../utils/theme";
import MobileNavMenu from "./MobileNavMenu";

const Wrapper = styled.div`
  z-index: 9000;
  position: sticky;
  top: 0;
  display: flex;
  width: 100%;
  height: 4rem;
  padding: 0.5rem;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  border-bottom: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const MenuIcon = styled.div`
  display: flex;
  width: 4rem;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.darkGreen};
  border-radius: 0.5rem;
  margin-right: 1rem;
`;

interface HeaderProps {
  open: boolean;
  toggleNavMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleNavMenu, open }) => {
  const mobile = useMediaQuery(theme.media.largeMobile);
  const headerRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const router = useRouter();
  return (
    <Wrapper ref={headerRef}>
      {open && (
        <MobileNavMenu toggleNavMenu={toggleNavMenu} clickRef={headerRef} />
      )}

      <ContentWrapper>
        <h1
          className="text-1l font-extrabold tracking-tight text-white sm:text-[3rem]"
          onClick={() => {
            if (!session?.data?.user?.organizationId) return;
            void router.push(
              `/${session?.data?.user?.organizationId}/dashboard`
            );
          }}
        >
          Straffe<span className="text-[hsl(280,100%,60%)]">Pils</span>
        </h1>
        {mobile && <MenuIcon onClick={toggleNavMenu}>Menu</MenuIcon>}
      </ContentWrapper>
    </Wrapper>
  );
};

export default Header;
