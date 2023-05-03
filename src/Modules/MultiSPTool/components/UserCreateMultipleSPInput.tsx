import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import styled from "styled-components";
import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";
import { MultiSPContext } from "../context";
import type { CreateMultipleSPUserEntry } from "../types";
import AddSPButton from "./AddSPButton";
import MinusIcon from "./MinusIcon";
import SPRow from "./SPRow";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

const SPContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 1rem;
`;

const SPUserRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const SPContentRow = styled.div`
  display: flex;
  height: 40px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
interface UserSPLineProps {
  entry: CreateMultipleSPUserEntry;
  users: RouterOutputs["users"]["getOrganizationUsers"]["data"]["users"];
}

const UserCreateMultipleSPInput: React.FC<UserSPLineProps> = ({ entry }) => {
  const router = useRouter();
  const session = useSession();
  const { organizationId } = router.query;
  const { handleAddSP, handleRemoveUser } = useContext(MultiSPContext);

  const { data: SPReasons } =
    api.punishmentReasons.getPunishmentReasons.useQuery(
      {
        organizationId: organizationId as string,
      },
      {
        enabled: !!organizationId,
      }
    );
  const { data: SPTypes } = api.punishmentTypes.getPunishmentTypes.useQuery(
    {
      organizationId: organizationId as string,
    },
    {
      enabled: !!organizationId,
    }
  );

  const SPReasonOptions =
    SPReasons?.data.punishmentReasons.map((reason) => {
      return {
        label: reason.name,
        value: reason.id,
      };
    }) ?? [];

  const SPTypeOptions =
    SPTypes?.data.punishmentTypes.map((type) => {
      return {
        label: type.name,
        value: type.id,
      };
    }) ?? [];

  if (!entry) {
    return <>wtf</>;
  }

  const spRows =
    entry.sp?.map((sp, index) => (
      <SPRow
        userId={session.data?.user.id ?? ""}
        entry={entry}
        index={index}
        spReasonOptions={SPReasonOptions}
        spTypeOptions={SPTypeOptions}
        key={index}
      />
    )) ?? [];

  if (session.status !== "authenticated") {
    return <Wrapper>Loading...</Wrapper>;
  }
  return (
    <Wrapper>
      <LabelWrapper>
        {entry.name}
        <MinusIcon onClick={handleRemoveUser(entry.id)} />
      </LabelWrapper>
      <SPContent>
        <SPUserRowContainer>{spRows}</SPUserRowContainer>
        <SPContentRow>
          <AddSPButton onClick={handleAddSP(entry.id, session.data?.user.id)} />
        </SPContentRow>
      </SPContent>
    </Wrapper>
  );
};

export default UserCreateMultipleSPInput;
