import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "styled-components";
import theme from "../utils/theme";
import "../i18";
import { api } from "../utils/api";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const {data: me, isFetching: fetching, isLoading: loading } = api.users.me.useQuery();
  const router = useRouter()


  useEffect(() => {
    if (!fetching && !loading && !me?.data?.user?.organizationId) {
      router.push("/").catch((err) => console.error(err));
    }
  }, [me, fetching, loading])

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
