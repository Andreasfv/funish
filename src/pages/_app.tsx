import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "styled-components";
import RouteGuard from "../components/RouteGuard";
import "../i18";
import "../styles/globals.css";
import { api } from "../utils/api";
import theme from "../utils/theme";

const publicPages = ["/", "/[[...index]]"];

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        {publicPages.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        )}
        {/* Root is for modal */}
        <div id="root" />
        <ToastContainer />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
