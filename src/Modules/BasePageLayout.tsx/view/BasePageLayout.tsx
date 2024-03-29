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
  flex-direction: row;
  overflow: auto;
  height: 100%;
`;

interface BasePageLayoutProps {
  children: React.ReactNode;
}

/**
 * This component is currently imported to each page view, it should be implemented somewhere higher in the hierarchy such that it wraps all
 * pages requiring authentication to be viewed.
 * TODO: Implement this component higher in the hierarchy such that it wraps all pages when authenticated.
 */
export const BasePageLayout: React.FC<BasePageLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const mobile = useMediaQuery(theme.media.largeMobile);

  function toggleNavMenu() {
    setOpen(!open);
  }

  return (
    <Wrapper>
      <Header toggleNavMenu={toggleNavMenu} open={open} />
      <ContentWrapper>
        {!mobile && <Sidebar />}
        {children}
      </ContentWrapper>
    </Wrapper>
  );
};
