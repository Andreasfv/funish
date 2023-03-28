import {
  RedirectToCreateOrganization,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";
import Redirect from "../../components/Redirect";
import { api } from "../../utils/api";

const LoadingText = styled.div`
  font-size: 1.5rem;
  color: white;
  font-weight: 600;
`;

const NoOrganizationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: wthie;
  height: 400px;
  width: 400px;
  border-radius: 0.5rem;
`;

const OrganizationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const OrganizationRow = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  border-radius: 0.5rem;
  padding: 0.5rem;
  div {
    flex: 1;
    align-items: center;
    display: flex;
  }
  div:first-child {
    justify-content: flex-start;
  }
  div:last-child {
    justify-content: flex-end;
  }
`;

const JoinOrganizationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.lightGreen};
  color: black;
  padding: 0.3rem 1rem;
  border-radius: 0.3rem;

  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

const RedirectPage: React.FC = () => {
  const user = useUser();
  const router = useRouter();
  const session = useSession();
  const { data: organizations } = api.organizations.getOrganizations.useQuery(
    {}
  );
  const { mutate: assignUserToOrganization } =
    api.users.addOrganizationToClerkUser.useMutation();

  if (!user.isLoaded) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <LoadingText>Loading...</LoadingText>
      </main>
    );
  }

  function handleJoinOrganization(organizationId: string) {
    return () => {
      assignUserToOrganization({
        organizationId,
        userId: session.session?.user?.id ?? "",
      });
    };
  }

  if (
    !session.session?.user?.publicMetadata.organizationId &&
    session.session?.user.id
  ) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <NoOrganizationWrapper>
          <LoadingText>You are not part of any organization</LoadingText>
          <br></br>
          <LoadingText>Join organization: </LoadingText>
          <OrganizationsWrapper>
            {organizations?.data ? (
              organizations?.data?.organizations.map((organization) => (
                <OrganizationRow>
                  <div>{organization.name}</div>
                  <div>
                    <JoinOrganizationButton
                      onClick={handleJoinOrganization(organization.id)}
                    >
                      Join
                    </JoinOrganizationButton>
                  </div>
                </OrganizationRow>
              ))
            ) : (
              <LoadingText>Loading...</LoadingText>
            )}
          </OrganizationsWrapper>
        </NoOrganizationWrapper>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <LoadingText>Redirecting...</LoadingText>
      <Redirect to="/" />
    </main>
  );
};

export default RedirectPage;
