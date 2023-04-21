import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "../../../utils/media/useMedia";
import theme from "../../../utils/theme";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
`;

const SidebarNinja = styled.div`
  display: none;

  width: 200px;
  height: 100%;
`;
const HeaderNinja = styled.div`
  display: none;
  height: 4rem;
  width: 100%;
`;
interface BasePageLayoutProps {
  children: React.ReactNode;
}

export const BasePageLayout: React.FC<BasePageLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const mobile = useMediaQuery(theme.media.largeMobile);

  function toggleNavMenu() {
    setOpen(!open);
  }

  return (
    <Wrapper>
      <HeaderNinja></HeaderNinja>
      <Header toggleNavMenu={toggleNavMenu} open={open} />
      <ContentWrapper>
        {!mobile && <SidebarNinja />}
        {!mobile && <Sidebar />}
        {children}
      </ContentWrapper>
    </Wrapper>
  );
};
