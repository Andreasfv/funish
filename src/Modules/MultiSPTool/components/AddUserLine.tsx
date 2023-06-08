import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FormSelect from "../../../components/input/formSelect";
import Spinner from "../../../components/Spiner";
import type { RouterOutputs } from "../../../utils/api";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 3px solid ${(props) => props.theme.colors.green};
  color: ${(props) => props.theme.colors.green};
  font-size: 2rem;
  text-align: center;

  :hover {
    cursor: pointer;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    & ~ .text {
      color: ${(props) => props.theme.colors.spPurple};
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }
  }
`;

const IconText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-bottom: 0.25rem;
`;

const SelectWrapper = styled.div`
  width: 300px;
`;

interface AddUserLineProps {
  users:
    | RouterOutputs["users"]["getOrganizationUsers"]["data"]["users"]
    | undefined;

  handleSelect: (userId: string) => void;
}

const AddUserLine: React.FC<AddUserLineProps> = ({ users, handleSelect }) => {
  const [open, setOpen] = useState(false);
  const [nameText, setNameText] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  function handleToggleOpen() {
    setOpen(!open);
  }

  const selectOptions =
    users?.map((user) => {
      return {
        value: user.id,
        label: user.name ?? "",
      };
    }) ?? [];

  function handleUserSelection(userId: string) {
    handleSelect(userId);
    setOpen(false);
  }

  function handleUserTextChange(text: string) {
    setNameText(text);
  }

  // Handle close on click outside useEffect
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Wrapper ref={wrapperRef}>
      {users ? (
        <IconWrapper tabIndex={0} onClick={handleToggleOpen}>
          <IconText>+</IconText>
        </IconWrapper>
      ) : (
        <Spinner />
      )}

      {open ? (
        <SelectWrapper>
          <FormSelect
            options={selectOptions}
            text={nameText}
            handleChange={handleUserSelection}
            handleTextChange={handleUserTextChange}
            focusOnSpawn={true}
          />
        </SelectWrapper>
      ) : (
        <div className="text">Legg til bruker</div>
      )}
    </Wrapper>
  );
};

export default AddUserLine;
