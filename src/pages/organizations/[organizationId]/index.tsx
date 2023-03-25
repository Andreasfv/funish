import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";

const Organization: NextPage = () => {
  const router = useRouter();
  const { data: organization } = api.organizations.getOrganization.useQuery(
    router.query.organizationId as string
  );
  return (
    <>
      <Head>
        <title>Organizations</title>
        <meta name="description" content="Organizations" />
      </Head>
      <>
        <h1>{organization?.data?.organization?.name}</h1>
      </>
    </>
  );
};

export default Organization;
