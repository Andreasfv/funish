import type { Punishment, PunishmentReason, PunishmentType, User } from "@prisma/client";
import styled from "styled-components";

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
    `

interface UserPunishmentsRowProps {
    user: User & {
        punishments: (Punishment & {
            type: PunishmentType;
            reason: PunishmentReason;
            createdBy: User;
        })[];
    }
    onClick: () => void;
}

const UserPunishmentsRow: React.FC<UserPunishmentsRowProps> = ({user, onClick}) => {

    let approvedCount = 0
    let disaprovedCount = 0

    user.punishments.forEach(punishment => {
       if (punishment.approved) approvedCount += punishment.quantity
       else disaprovedCount += punishment.quantity 
    })



    return (
        <Wrapper onClick={onClick}>
            <div>{user.name}</div>
            <div>A: {approvedCount}</div>
            <div>U: {disaprovedCount}</div>
        </Wrapper>
    );
}

export default UserPunishmentsRow;