import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "../i18";
import "antd/dist/reset.css";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Header } from "../components/Header/Header";
import { ConfigProvider } from "antd";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#291321",
          },
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
