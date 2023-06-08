import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import AddUserLine from "../components/AddUserLine";
import { SubmitButton } from "../components/SubmitButton";
import UserCreateMultipleSPInput from "../components/UserCreateMultipleSPInput";
import { MultiSPContext } from "../context";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
  overflow-y: auto;
  padding-bottom: 2rem;
`;

const LabelWrapper = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.5rem 0 0;
  border-bottom: 2px solid ${(props) => props.theme.colors.darkGreen};
`;
const ErrorWrapper = styled.div`
  color: ${(props) => props.theme.colors.error};
`;

const MultiSPTool: React.FC = () => {
  const router = useRouter();
  const { organizationId } = router.query;
  const { data: users } = api.users.getOrganizationUsers.useQuery(
    {
      organizationId: organizationId as string,
      sort: "name",
    },
    {
      onSuccess(data) {
        handleSetUsers(data.data.users ?? []);
      },
    }
  );

  const {
    usersSP,
    errors,
    handleAddUser,
    handleSetUsers,
    handleSetOrganization,
    handleSubmit,
  } = useContext(MultiSPContext);

  useEffect(() => {
    handleSetOrganization(organizationId as string);

    // Should probably add fetch of reason options and type options for the UserCreateMultipleSPInput component into the context here.
    // Such that it doesnt refetch for each member added. This is an oversight and will save queries over time.
  }, [handleSetOrganization, organizationId]);

  const unselectedUsers = users?.data?.users?.filter((user) => {
    return !usersSP?.find((spUser) => spUser.id === user.id);
  });
  return (
    <BasePageLayout>
      <Wrapper>
        <ContentWrapper>
          <LabelWrapper>Opprett flere SP</LabelWrapper>
          {usersSP.map((spUser) => {
            return (
              <UserCreateMultipleSPInput
                key={spUser.id}
                entry={spUser}
                users={users?.data?.users ?? []}
              />
            );
          })}
          <AddUserLine users={unselectedUsers} handleSelect={handleAddUser} />
          {errors.length > 0 && (
            <ErrorWrapper>
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </ErrorWrapper>
          )}
          <SubmitButton text={"Send inn SP"} onClick={handleSubmit} />
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default MultiSPTool;
