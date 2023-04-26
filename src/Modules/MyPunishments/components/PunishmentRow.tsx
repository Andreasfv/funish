import type { Punishment, PunishmentReason, User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0.3rem;
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme.colors.green};
  flex-wrap: wrap;
  overflow: wrap;
  & > div:first-child {
    min-width: 135px;
  }
  div {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
    cursor: pointer;
  }
`;

const OpenWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.green};
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.3rem;
  border-radius: 0.3rem;
  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
    cursor: pointer;
  }
`;

const LineWrapper = styled.div`
  display: flex;
  flex-direction: row
  width: 100%;
  div {
    flex: 1;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.3rem;
  border-radius: 0.3rem;
  background-color: white;
`;

const UserImage = styled(Image)`
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
`;

interface PunishmentRowProps {
  punishment: Punishment & {
    createdBy: User;
    reason: PunishmentReason;
  };
}
const PunishmentRow: React.FC<PunishmentRowProps> = ({ punishment }) => {
  const [open, setOpen] = useState(false);

  function handleOnClick() {
    setOpen(!open);
  }

  if (open) {
    return (
      <OpenWrapper onClick={handleOnClick}>
        <LineWrapper>
          <div>{punishment.reason.name}</div>
          <div>Antall: {punishment.quantity}</div>
          <div>Fra: {punishment.createdBy.name}</div>
          <div></div>
        </LineWrapper>
        <TextWrapper>
          <div>{punishment.description}</div>
        </TextWrapper>
      </OpenWrapper>
    );
  }

  return (
    <Wrapper onClick={handleOnClick}>
      <div>{punishment.reason.name}</div>
      <div>{punishment.quantity}</div>
      <UserImage
        width={16}
        height={16}
        src={punishment.createdBy.image ?? ""}
        alt=":)"
        unoptimized
      />
    </Wrapper>
  );
};

export default PunishmentRow;
