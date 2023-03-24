import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import css from "styled-jsx/css";

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

const ErrorSpan = styled.span`
  color: ${(props) => props.theme.colors.red};
  font-size: 0.8rem;
  margin-top: 0.2rem;
  margin-left: 0.2rem;
`;

type Option = {
  value: string;
  label: string;
};
interface FormSelectProps {
  options: Option[];
  placeholder?: string;
  handleChange: (value: string) => void;
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  options,
  placeholder,
  handleChange,
  error,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options); // [
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggling = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    //We use a const so that the update is immediatedly. setState can be slow.
    const select = false;
    setSelected(false);
    setSearch(e.currentTarget.value);

    const filteredOptions = options.filter((option) => {
      if (select) return true;

      return option.label
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase());
    });

    setFilteredOptions(filteredOptions);
  };

  const onOptionClicked = (value: Option) => () => {
    setFilteredOptions(options);
    setSelected(true);
    setIsOpen(false);
    setSearch(value.label);
    handleChange(value.value);
  };

  options =
    options.length >= 1
      ? options
      : [{ value: "", label: t("input.error.no-options")! }];

  useEffect(() => {
    // Make sure the options are updated when the options prop changes
    setFilteredOptions(options);
  }, [options]);

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
    <Wrapper>
      <BaseSelect
        placeholder={placeholder}
        onClick={toggling}
        isOpen={isOpen}
        value={search}
        onChange={handleSearch}
        tabIndex={0}
      />
      {isOpen && (
        <DropDownContainer ref={dropdownRef}>
          <DropDownListContainer>
            {filteredOptions.map((option) => (
              <ListItem
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
