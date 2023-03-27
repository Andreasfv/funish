import type { Punishment, PunishmentType, PunishmentReason, User } from "@prisma/client";
import { useState } from "react";
import styled from "styled-components";
import { useAdmin } from "../../../utils/admin/useAdmin";
import { useMediaQuery } from "../../../utils/media/useMedia";
import theme from "../../../utils/theme";
interface WrapperProps {
    open: boolean;
}

// TODO: MAKE THIS INTO GRID. IT'S A MESS.
const Wrapper = styled.div<WrapperProps>`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 2rem;
    background-color: ${(props) => props.theme.colors.green};
    border-radius: 0.5rem;
    div {
        flex: 1 2;
        display: flex;
        align-items: center;
        height: 100%;
    }

    @media ${theme.media.largeMobile} {
        height: 12rem;
    }
}
`
const LineWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 24px;
    padding: 0.5rem;
    flex: 1;
`
const Button = styled.button`
    height: 100%;
    border-radius: 0.5rem;
    pading: 0.5rem;
`

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
    @media !${theme.media.largeMobile} {
        left: 0
    }
`

const DeleteButton = styled(Button)`
position: absolute;
height: 2rem;
right: 0;
padding: 0 1rem;
    background-color: ${(props) => props.theme.colors.red};
    :hover {
        background-color: red;
    }
`

const ButtonWrapper = styled.div`
    position: relative;
    flex: 1;
    min-width: 175px;
    @media ${theme.media.largeMobile} {
        min-width: 85px;
        max-width: 90px;
    }
`

interface PunishmentRowProps {
    punishment: Punishment & {
        type: PunishmentType;
        reason: PunishmentReason;
        createdBy: User;
        user: User;
    }
    deletePunishment: () => void;
    approvePunishment: () => void
}

const PunishmentRow: React.FC<PunishmentRowProps> = ({punishment, deletePunishment, approvePunishment}) => {
    const isAdmin = useAdmin()
    const mobile = useMediaQuery(theme.media.largeMobile)
    const [open, setOpen] = useState(false)

    function openRow() {
        if(!mobile) return
        setOpen(!open)
    }

    if (mobile) {
        return (

        <Wrapper onClick={openRow} open={open}>
            <LineWrapper>
            <div>{punishment.type.name}</div>
            <div>{punishment.reason.name}</div>
            {isAdmin &&
                <ButtonWrapper>
                    {!punishment.approved && <ApproveButton onClick={approvePunishment}> Y </ApproveButton>}
                </ButtonWrapper>
            }
            </LineWrapper>
            <LineWrapper>
            <div>{punishment.createdBy.name}</div>
            <div>{punishment.approved ? "Godkjent" : "Ikke godkjent"}</div>
            <ButtonWrapper></ButtonWrapper>
            </LineWrapper>
            <LineWrapper>
                <div>{punishment.description}</div>
                {isAdmin && 
                <ButtonWrapper>
                    <DeleteButton onClick={deletePunishment}> X </DeleteButton>
                </ButtonWrapper>
                }
            </LineWrapper>
        </Wrapper>
        )
    }

    return (
        <Wrapper onClick={openRow} open={open}>
            <LineWrapper>
            <div>{punishment.type.name}</div>
            {!mobile && (<div>{punishment.reason.name}</div>)}
            <div>{punishment.createdBy.name}</div>

            {!mobile && <div>{punishment.approved ? "Godkjent" : "Ikke godkjent"}</div>}
            {isAdmin && 
            <ButtonWrapper>
                {!punishment.approved && <ApproveButton onClick={approvePunishment}>
                    {mobile ? "Y" : "Approve"}
                </ApproveButton>}
                <DeleteButton onClick={deletePunishment}>
                    {mobile ? "X" : "Delete"}
                </DeleteButton>
            </ButtonWrapper>}
            </LineWrapper>
            {open && 
                <LineWrapper>
                    <div>Reason: {punishment.reason.name}</div>
                    <div>Quantity: {punishment.quantity}</div>
                    <div></div>
                    <div></div>
                </LineWrapper>
            }
        </Wrapper>
    )
}

export default PunishmentRow;