import type {
  Punishment,
  PunishmentReason,
  PunishmentType,
  User,
} from "@prisma/client";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useAdmin } from "../../../../../utils/admin/useAdmin";
import { useMediaQuery } from "../../../../../utils/media/useMedia";
import theme from "../../../../../utils/theme";
interface WrapperProps {
  open: boolean;
}

// TODO: MAKE THIS INTO GRID. IT'S A MESS. or not idk.
const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${(props) => props.theme.colors.green};
  border-radius: 0.5rem;
  padding: 1rem;
  gap: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.green};

  & > div > div {
    flex: 1 2;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    justify-content
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.colors.darkGreen};
  }
`;
const LineWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 24px;
  flex: 1;
  @media ${theme.media.largeMobile} {
    & > :last-child {
      justify-content: flex-end;
    }
  }
`;

const DescriptionWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Button = styled.button`
  height: 100%;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const ApproveButton = styled(Button)`
  position: absolute;
  height: 2rem;
  padding: 0 1rem;

  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }

  @media ${theme.media.largeMobile} {
    left: null;
    right: 0;
  }
`;

const DeleteButton = styled(Button)`
  position: absolute;
  height: 2rem;
  right: 0;
  padding: 0 1rem;
  background-color: ${(props) => props.theme.colors.red};
  :hover {
    background-color: red;
  }
`;

const ProofButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 1rem;
  background-color: ${(props) => props.theme.colors.lightDarkGreen};
  :hover {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 175px;
  @media ${theme.media.largeMobile} {
    margin-left: auto;
    min-width: 85px;
    max-width: 90px;
  }
`;

const TypeWrapper = styled.div<{ approved: boolean }>`
  display: flex;
  padding: 0 0.5rem;
  width: auto;
  background-color: ${(props) =>
    props.approved
      ? props.theme.colors.lightSuccess
      : props.theme.colors.lightError};
  border-radius: 1rem;
`;

interface PunishmentRowProps {
  punishment: Punishment & {
    type: PunishmentType;
    reason: PunishmentReason;
    createdBy: User;
    user: User;
  };
  deletePunishment: () => void;
  approvePunishment: () => void;
  openProof: (image: string) => void;
}

const PunishmentRow: React.FC<PunishmentRowProps> = ({
  punishment,
  deletePunishment,
  approvePunishment,
  openProof,
}) => {
  const isAdmin = useAdmin();
  const mobile = useMediaQuery(theme.media.largeMobile);
  const [open, setOpen] = useState(false);
  const proofRef = useRef(null);
  const approveRef = useRef(null);
  const deleteRef = useRef(null);

  const handleOpenClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget == proofRef.current) return;
    setOpen(!open);
  };

  const handleApproveClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    approvePunishment();
  };

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    deletePunishment();
  };

  const handleProofClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    openProof(punishment.proof ?? "");
  };

  if (mobile) {
    return (
      <Wrapper onClick={handleOpenClick} open={open}>
        <LineWrapper>
          <div>
            <TypeWrapper approved={punishment.approved ? true : false}>
              {punishment.type.name} x {punishment.quantity}
            </TypeWrapper>
          </div>
          <div>{punishment.reason.name}</div>
          {isAdmin && !punishment.approved && (
            <ButtonWrapper>
              <ApproveButton ref={approveRef} onClick={handleApproveClick}>
                {" "}
                Y{" "}
              </ApproveButton>
            </ButtonWrapper>
          )}
        </LineWrapper>
        <LineWrapper>
          <div>{punishment.createdBy.name}</div>
          <div>{punishment.approved ? "Godkjent" : "Ikke godkjent"}</div>
        </LineWrapper>
        <DescriptionWrapper>
          <div>{punishment.description}</div>
        </DescriptionWrapper>
        <LineWrapper>
          {punishment.proof && punishment.proof !== "" && (
            <ProofButton ref={proofRef} onClick={handleProofClick}>
              Vis Bevis
            </ProofButton>
          )}
          {isAdmin && (
            <ButtonWrapper>
              <DeleteButton ref={deleteRef} onClick={handleDeleteClick}>
                {" "}
                X{" "}
              </DeleteButton>
            </ButtonWrapper>
          )}
        </LineWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper onClick={handleOpenClick} open={open}>
      <LineWrapper>
        <div>
          <TypeWrapper approved={punishment.approved ? true : false}>
            {punishment.type.name} x {punishment.quantity}
          </TypeWrapper>
        </div>

        {!open && <div>{punishment.reason.name}</div>}
        {punishment.proof && punishment.proof !== "" && (
          <div>
            <ProofButton ref={proofRef} onClick={handleProofClick}>
              Vis Bevis
            </ProofButton>
          </div>
        )}
        <div>{punishment.createdBy.name}</div>

        {!mobile && (
          <div>{punishment.approved ? "Godkjent" : "Ikke godkjent"}</div>
        )}
        {isAdmin && (
          <ButtonWrapper>
            {!punishment.approved && (
              <ApproveButton ref={approveRef} onClick={handleApproveClick}>
                {mobile ? "Y" : "Approve"}
              </ApproveButton>
            )}
            <DeleteButton ref={deleteRef} onClick={handleDeleteClick}>
              {mobile ? "X" : "Delete"}
            </DeleteButton>
          </ButtonWrapper>
        )}
      </LineWrapper>
      {open && (
        <>
          <LineWrapper>
            <div>For: {punishment.reason.name}</div>
            <div>Antall: {punishment.quantity}</div>
          </LineWrapper>
          {punishment.description && (
            <LineWrapper>{punishment.description}</LineWrapper>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default PunishmentRow;
