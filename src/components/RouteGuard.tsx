import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { JSXElementConstructor, ReactElement } from "react";
import { useEffect, useState } from "react";
import Spinner from "./Spiner";

const publicPages = ["/", "/[[...index]]"];

const RouteGuard = (props: {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}) => {
  const { children } = props;
  const router = useRouter();
  const session = useSession();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const authCheck = () => {
      if (session.status == "loading") return;

      if (
        session?.status == "unauthenticated" &&
        !publicPages.includes(router.pathname)
      ) {
        setAuthorized(false);
        router.push("/").catch((err) => console.warn(err));
      } else {
        if (
          router.query?.organizationId &&
          session?.data?.user?.organizationId !== router.query?.organizationId
        ) {
          if (session?.data?.user.organizationId) {
            router
              .push(`/${session?.data?.user?.organizationId}/dashboard`)
              .catch((err) => console.warn(err));
          } else {
            router.push(`/`).catch((err) => console.warn(err));
          }
        }
        setAuthorized(true);
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on("routeChangeStart", preventAccess);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeStart", preventAccess);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, session]);

  return children;
};

export default RouteGuard;
