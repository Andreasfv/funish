import type {
  Punishment,
  PunishmentReason,
  PunishmentType,
  User,
} from "@prisma/client";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ProfileIcon } from "../../../components/ProfileIcon";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;

  padding: 0.5rem;
  width: 100%;
  flex: 1;

  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.green};

  &:hover {
    cursor: pointer;
  }
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

interface LatestSPRowProps {
  punishment: Punishment & {
    user: User;
    type: PunishmentType;
    createdBy: User;
    reason: PunishmentReason;
  };
}
export const LatestSPRow: React.FC<LatestSPRowProps> = ({ punishment }) => {
  const router = useRouter();
  const { organizationId } = router.query;
  console.log(organizationId);
  function handleClick() {
    void router.push(
      `/[organizationId]/user-punishments/[userId]`,
      `/${organizationId as string}/user-punishments/${punishment.user.id}`
    );
  }

  return (
    <Wrapper onClick={handleClick}>
      {punishment.user.image && (
        <ProfileIcon src={punishment.user.image} width={32} height={32} />
      )}
      <div>{punishment.reason.name}</div>
      <div>🍺x{punishment.quantity}</div>
      <div>{`${punishment.createdAt.getDate()}/${`${
        punishment.createdAt.getMonth() + 1
      }`.padStart(2, "0")} ${`${punishment.createdAt.getHours()}`.padStart(
        2,
        "0"
      )}:${`${punishment.createdAt.getMinutes()}`.padStart(2, "0")}`}</div>
      <div>
        👮‍♀️📝
        {punishment.createdBy.image && (
          <ProfileIcon
            src={punishment.createdBy.image}
            width={32}
            height={32}
          />
        )}
      </div>
    </Wrapper>
  );
};
