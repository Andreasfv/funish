import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { OrganizationsTable } from "../../Modules/Organizations/OrganizationsTable";

const Organizations: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.user.role !== "SUPER_ADMIN") {
      if (session.data?.user.organizationId) {
        router
          .push(`/organizations/${session.data?.user.organizationId}`)
          .catch((err) => console.error(err));
      }
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Organizations</title>
        <meta name="description" content="Organizations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <OrganizationsTable />
      </>
    </>
  );
};

export default Organizations;
