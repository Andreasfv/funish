import {
  UserOutlined,
  HomeOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const { Header, Content, Footer, Sider } = Layout;

const BreadcrumbWrapper = styled.div`
  display: flex;
  justify-content: 100%;
  align-items: center;
  height: 100%;
`;

interface breadcrumbItem {
  label: string;
  href: string;
}
interface BasePageLayoutProps {
  children: React.ReactNode;
  breadcrumbItems: breadcrumbItem[];
}

export const BasePageLayout: React.FC<BasePageLayoutProps> = ({
  children,
  breadcrumbItems,
}) => {
  const router = useRouter();
  const session = useSession();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const breadcrumbItemsRender = breadcrumbItems.map((item) => (
    <Breadcrumb.Item
      key={item.label}
      onClick={() => {
        router.push(`/${item.href}`);
      }}
    >
      {item.label}
    </Breadcrumb.Item>
  ));

  const menuItems: MenuProps["items"] = [
    {
      key: "Home",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: () => {
        router.push("/");
      },
    },
  ];

  return (
    <Layout>
      <Header>
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={menuItems}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <BreadcrumbWrapper>
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              {breadcrumbItemsRender}
            </Breadcrumb>
          </BreadcrumbWrapper>
          <Content
            style={{
              padding: "1rem 24px 24px 24px",
              margin: 0,
              minHeight: 320,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
