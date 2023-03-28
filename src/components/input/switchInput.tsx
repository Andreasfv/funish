import styled from "styled-components";

interface SwitchInputProps {
  value: boolean;
  onClick: () => void;
  design?: {
    width?: string;
    height?: string;
    borderRadius?: string;
    backgroundColor?: string;
    activeColor?: string;
    inactiveColor?: string;
  };
}

type WrapperProps = Pick<SwitchInputProps, "design" | "value">;
const Wrapper = styled.div<WrapperProps>`
  display: flex;
  height: ${(props) => props.design?.height ?? "2rem"};
  width: ${(props) => props.design?.width ?? "4rem"};
  background-color: white;
  padding: 0.2rem;
  position: relative;
  border-radius: ${(props) => props.design?.borderRadius ?? "1rem"};
  :hover {
    cursor: pointer;
  }

  div {
    position: absolute;

    transform: ${(props) =>
      props.value ? "translateX(calc(100% - 0.4rem))" : `translateX(0%)`};
    background: ${(props) =>
      props.value
        ? props.design?.activeColor ?? "green"
        : props.design?.inactiveColor ?? "gray"};
    width: 50%;
    border-radius: 9999px;
    height: 80%;
    transition: transform 0.3s ease-in-out;
  }
`;

const SwitchInput: React.FC<SwitchInputProps> = ({
  value,
  onClick,
  design,
}) => {
  // a switch component that will go from left to right based on true or false.

  return (
    <Wrapper design={design} value={value} onClick={onClick}>
      <div />
    </Wrapper>
  );
};

export default SwitchInput;
