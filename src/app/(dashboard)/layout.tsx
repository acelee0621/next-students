"use client";
import React from "react";
import { UserOutlined, TeamOutlined, IdcardOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import avatar from "../../public/images/avatar001.png";
import Image from "next/image";

import { useRouter } from "next/navigation";

const { Header, Content, Footer, Sider } = Layout;

const sideBarMenuItems = [
  {
    key: "/character",
    icon: <UserOutlined />,
    label: "角色管理",
  },
  {
    key: "/origin",
    icon: <TeamOutlined />,
    label: "来源管理",
  },
  {
    key: "/profile",
    icon: <IdcardOutlined />,
  },
];

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const menuClick = (event) => {
    router.push(event.key);
  };

  return (
    <Layout className="h-full">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        // onClick={}
      >
        <div className="demo-logo-vertical">
          <Image
            style={{
              display: "block",
              width: "50%",
              borderRadius: "15px",
              margin: "20px auto",
            }}
            src={avatar}
            alt="avatar"
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={sideBarMenuItems}
          onClick={menuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Character Management ©{new Date().getFullYear()} Created by Aaron
        </Footer>
      </Layout>
    </Layout>
  );
}
