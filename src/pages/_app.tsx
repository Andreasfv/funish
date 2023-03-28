import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { ThemeProvider } from "styled-components";
import theme from "../utils/theme";
import "../i18";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Redirect from "../components/Redirect";
import { api } from "../utils/api";

const publicPages = [
  "/",
  "/redirect",
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]",
  "/[organizationId]/sign-in/[[...index]]",
];

const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const router = useRouter();

  return (
    <ClerkProvider
      navigate={(to) => router.push(to)}
      publishableKey={clerk_pub_key}
    >
      <ThemeProvider theme={theme}>
        {publicPages.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <Redirect to="/" />
            </SignedOut>
          </>
        )}
        <ToastContainer />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
