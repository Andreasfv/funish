import type {
  Punishment,
  PunishmentReason,
  PunishmentType,
  User,
} from "@prisma/client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 0.5rem;
  border-radius: 0.5rem;
  div {
    flex: 1;
    display: flex;
    align-items: center;
  }
  :hover {
    background-color: ${(props) => props.theme.colors.green};
    cursor: pointer;
  }

  @media ${(props) => props.theme.media.largeMobile} {
    height: 3rem;
    & > :first-child {
      flex: 2;
    }
  }
`;

interface UserPunishmentsRowProps {
  user: {
    id: string;
    receivedPunishments: {
      user: User;
      id: string;
      type: PunishmentType;
      createdBy: User;
      reason: PunishmentReason;
      reedemed: boolean;
      quantity: number;
      approved: boolean;
    }[];
    name: string | null;
  };
  onClick: () => void;
}

const UserPunishmentsRow: React.FC<UserPunishmentsRowProps> = ({
  user,
  onClick,
}) => {
  const [approvedCount, setApprovedCount] = useState(0);
  const [disaprovedCount, setDisaprovedCount] = useState(0);

  useEffect(() => {
    const approved = user.receivedPunishments.filter(
      (p) => p.approved && p.user.id === user.id
    );
    const disapproved = user.receivedPunishments.filter(
      (p) => !p.approved && p.user.id === user.id
    );
    setApprovedCount(approved.length);
    setDisaprovedCount(disapproved.length);
  }, [user]);

  return (
    <Wrapper onClick={onClick}>
      <div>{user.name}</div>
      <div>A: {approvedCount}</div>
      <div>U: {disaprovedCount}</div>
    </Wrapper>
  );
};

export default UserPunishmentsRow;
