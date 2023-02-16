import {
  UserOutlined,
  HomeOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

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

interface BasePageLayoutProps {
  children: React.ReactNode;
}

export const BasePageLayout: React.FC<BasePageLayoutProps> = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <Sidebar />
        {children}
      </ContentWrapper>
    </Wrapper>
  );
};
