import type { Punishment, PunishmentReason, User } from "@prisma/client";
import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.3rem;
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme.colors.green};
  flex-wrap: wrap;
  overflow: wrap;
  div {
    order: 1;
    flex: 1 1 160px;
    min-width: 135px;
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
`

const LineWrapper = styled.div`
  display: flex;
  flex-direction: row
  width: 100%;
  div {
    flex: 1;
  }
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.3rem;
  border-radius: 0.3rem;
  background-color: white;
`

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
    )
  }

  return (
    <Wrapper onClick={handleOnClick}>
      <div>{punishment.reason.name}</div>
      <div>Antall: {punishment.quantity}</div>
      <div>Fra: {punishment.createdBy.name}</div>
      <div>Besk: {punishment.description}</div>
    </Wrapper>
  );
};

export default PunishmentRow;
