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
import 'react-toastify/dist/ReactToastify.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter()
    if (session?.user?.organizationId) {
      router
        .push(`/`)
        .catch((err) => console.warn(err));
    }

  return (
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
          <ToastContainer />
        </ThemeProvider>
      </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
