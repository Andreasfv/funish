import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import ActionsPaper, { ActionStatus } from "../components/ActionsPaper";
import OrganizationUsersPaper from "../components/OrganizationUsersPaper";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 0.5rem;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.lightGreen};
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
  box-shadow: ${(props) => props.theme.shadow.wrapperShadow};
  gap: 1rem;
`;

const ManageOrganization: React.FC = () => {
  const orgUsersRef = useRef(null);
  const [getFunksStatus, setGetFunksStatus] = useState<ActionStatus>("info");
  const [getFunksInfoMessage, setGetFunksInfoMessage] = useState("");
  const router = useRouter();
  const { organizationId } = router.query;

  const { data: organization, isLoading: organizationLoading } =
    api.organizations.getOrganization.useQuery(organizationId as string, {
      enabled: !!organizationId,
    });

  const {
    data: users,
    isLoading: usersLoading,
    refetch,
  } = api.users.getOrganizationUsers.useQuery(
    {
      organizationId: organizationId as string,
      sort: "name",
    },
    {
      enabled: !!organizationId,
    }
  );

  const { mutate, isLoading, error, isSuccess, data } =
    api.organizations.populateOrganizationWithUsersFromKSGNett.useMutation();

  useEffect(() => {
    setGetFunksStatus(data?.ok ? "success" : error?.message ? "error" : "info");
  }, [data, error]);

  function handleGetFunks() {
    setGetFunksInfoMessage("");
    setGetFunksStatus("loading");
    mutate(
      {
        organizationId: organizationId as string,
        ksgGangName: organization?.data?.organization?.name ?? "",
      },
      {
        onSuccess: (data) => {
          setGetFunksStatus("success");
          setGetFunksInfoMessage("Funker hentet!");
          toast("Funker hentet!", {
            type: "success",
            position: "bottom-center",
          });
          void refetch();
        },
        onError: (error) => {
          setGetFunksStatus("error");
          setGetFunksInfoMessage("Noe gikk galt!");
          console.warn(error);
          toast("Noe gikk galt!", {
            type: "error",
            position: "bottom-center",
          });
        },
      }
    );
  }
  const actions = [
    {
      label: "Hent funker",
      onClick: handleGetFunks,
      status: getFunksStatus,
      infoMessage: getFunksInfoMessage,
    },
  ];
  return (
    <BasePageLayout>
      <Wrapper>
        <ContentWrapper>
          <h1>Manage Organization</h1>
          <ActionsPaper actions={actions} />
          <h1>Medlemmer</h1>
          <OrganizationUsersPaper
            users={users?.data?.users ?? []}
            isLoading={usersLoading}
          />
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default ManageOrganization;
