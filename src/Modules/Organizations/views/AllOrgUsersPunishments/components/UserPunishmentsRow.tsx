import type { PunishmentReason, PunishmentType, User } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 2.5rem;
  background-color: ${(props) => props.theme.colors.lightGreen};
  padding: 0.5rem;
  border-radius: 0.5rem;
  align-items: center;
  div {
    flex: 1;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  :hover {
    background-color: ${(props) => props.theme.colors.green};
    cursor: pointer;
  }

  @media ${(props) => props.theme.media.largeMobile} {
    height: 3rem;
    & > :nth-child(2) {
      flex: 2;
    }
  }
`;

const UserImage = styled(Image)`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  margin-right: 5px;
`;
interface UserPunishmentsRowProps {
  user: {
    id: string;
    image: string | null;
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
  const proofRef = useRef(null);
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
      <UserImage
        width={16}
        height={16}
        src={user.image ?? ""}
        alt=":)"
        unoptimized
      />
      <div>{user.name}</div>
      <div>A: {approvedCount}</div>
      <div>U: {disaprovedCount}</div>
    </Wrapper>
  );
};

export default UserPunishmentsRow;
