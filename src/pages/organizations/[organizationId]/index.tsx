import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";

const Organization: NextPage = () => {
  const router = useRouter();
  const { data: organization } = api.organizations.getOrganization.useQuery(
    router.query.organizationId as string
  );
  return (
    <>
      <head>
        <title>Organizations</title>
        <meta name="description" content="Organizations" />
      </head>
      <>
        <h1>{organization?.data?.organization?.name}</h1>
      </>
    </>
  );
};

export default Organization;
