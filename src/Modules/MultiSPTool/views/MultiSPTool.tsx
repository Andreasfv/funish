import { useRouter } from "next/router";
import { useContext } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import AddUserLine from "../components/AddUserLine";
import UserCreateMultipleSPInput from "../components/UserCreateMultipleSPInput";
import { MultiSPContext } from "../context";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  height: 100%;
  padding-bottom: 4rem;
  overflow-y: auto;
  margin-bottom: 4rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 1rem;
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

  const { usersSP, handleAddUser, handleSetUsers } = useContext(MultiSPContext);
  //function add new SP to SPEntry

  const unselectedUsers = users?.data?.users?.filter((user) => {
    return !usersSP?.find((spUser) => spUser.id === user.id);
  });
  return (
    <BasePageLayout>
      <Wrapper>
        <ContentWrapper>
          Å sende in SP her fungerer ikke, men er et eksempel på hvordan å sende
          in sp etter feks møte kan gjøres. Tanken er hovedsakelig at dette er
          noe SP ansvarlig/OHM har tilgang på {":)"}
          {usersSP.map((spUser) => {
            console.log(spUser);
            return (
              <UserCreateMultipleSPInput
                key={spUser.id}
                entry={spUser}
                users={users?.data?.users ?? []}
              />
            );
          })}
          <AddUserLine users={unselectedUsers} handleSelect={handleAddUser} />
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default MultiSPTool;
