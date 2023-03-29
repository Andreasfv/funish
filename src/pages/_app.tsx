import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "styled-components";
import theme from "../utils/theme";
import "../i18";
import { api } from "../utils/api";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { partialUtil } from "zod/lib/helpers/partialUtil";
import RouteGuard from "../components/RouteGuard";

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
