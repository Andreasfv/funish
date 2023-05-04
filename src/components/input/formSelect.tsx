import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 4px;
`;

interface BaseSelectProps {
  isOpen: boolean;
}
const BaseSelect = styled.input<BaseSelectProps>`
  height: 2.5rem;
  padding: 0rem 0.5rem;
  cursor: pointer;
  align-items: center;
  border: 2px solid ${(props) => props.theme.colors.green};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;

  :focus {
    outline: ${(props) => props.theme.colors.darkGreen};
    border-color: ${(props) => props.theme.colors.darkGreen};
  }
  ${(props) =>
    props.isOpen &&
    `
      border-bottom: 2px solid white;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    `}
`;

const DropDownContainer = styled.div`
  position: relative;
  width: 100%;
  top: -1px;
  z-index: 5000;
`;

const DropDownListContainer = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  padding-bottom: 0.5rem;
  background: white;
  border-radius: 0 0 4px 4px;
  border-top: 1px solid ${(props) => props.theme.colors.darkGreen};
  border-bottom: 2px solid ${(props) => props.theme.colors.darkGreen};
  border-right: 2px solid ${(props) => props.theme.colors.darkGreen};
  border-left: 2px solid ${(props) => props.theme.colors.darkGreen};
  box-sizing: border-box;
  color: black;
  font-size: 1rem;
  z-index: 5000;

  &:first-child {
  }
`;

const ListItem = styled.li`
  list-style: none;
  padding: 0.5rem 0.5rem;

  :hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

type Option = {
  value: string;
  label: string;
};
interface FormSelectProps {
  options: Option[];
  placeholder?: string;
  handleChange: (value: string) => void;
  text: string;
  handleTextChange: (value: string) => void;
  focusOnSpawn?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  options,
  placeholder,
  text,
  handleChange,
  handleTextChange,
  focusOnSpawn = false,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options); // [
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggling = () => setIsOpen(!isOpen);
  const selectRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (text !== "") return;
    setFilteredOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (!focusOnSpawn) return;
    selectRef.current?.focus();
    setIsOpen(true);
  }, [focusOnSpawn]);

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    //We use a const so that the update is immediatedly. setState can be slow.
    handleTextChange(e.currentTarget.value);
    const filteredOptions = options.filter((option) => {
      return option.label
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase());
    });

    setFilteredOptions(filteredOptions);
  };

  const onOptionClicked = (value: Option) => () => {
    setFilteredOptions(options);
    setIsOpen(false);
    handleChange(value.value);
    if (handleTextChange) {
      handleTextChange(value.label);
    }
  };

  useEffect(() => {
    // Handle closing the dropdown if the user clicks outside of it
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Wrapper className="-form-select--wrapper">
      <BaseSelect
        className="-form-select--base-select"
        placeholder={placeholder}
        onClick={toggling}
        isOpen={isOpen}
        value={text}
        onChange={handleSearch}
        tabIndex={0}
        ref={selectRef}
      />
      {isOpen && (
        <DropDownContainer
          ref={dropdownRef}
          className="-form-select--dropdown-container"
        >
          <DropDownListContainer className="-form-select--dropdown-list-container">
            {filteredOptions.map((option, index) => (
              <ListItem
                className="-form-select--list-item"
                key={index}
                onClick={onOptionClicked(option)}
                value={option.value}
                tabIndex={0}
              >
                {option.label}
              </ListItem>
            ))}
          </DropDownListContainer>
        </DropDownContainer>
      )}
    </Wrapper>
  );
};

export default FormSelect;
