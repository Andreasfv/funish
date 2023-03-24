import { Punishment, PunishmentReason, User } from "@prisma/client";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.3rem;
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme.colors.green};
  div {
    flex: 1;
  }
`;

interface PunishmentRowProps {
  punishment: Punishment & {
    createdBy: User;
    reason: PunishmentReason;
  };
}
const PunishmentRow: React.FC<PunishmentRowProps> = ({ punishment }) => {
  return (
    <Wrapper>
      <div>{punishment.reason.name}</div>
      <div>Antall: {punishment.quantity}</div>
      <div>Fra: {punishment.createdBy.name}</div>
      <div>Besk: {punishment.description}</div>
    </Wrapper>
  );
};

export default PunishmentRow;
