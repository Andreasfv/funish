import { useContext } from "react";
import styled from "styled-components";
import Spinner from "../../../components/Spiner";
import { MultiSPContext } from "../context";

interface SubmitButtonProps {
  text: string;
  width?: string;
  height?: string;
  onClick?: () => void;
}

interface SubmitProps {
  width?: string;
  height?: string;
  onClick?: () => void;
}
export const Submit = styled.button<SubmitProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.green};
  margin-bottom: 3rem;
`;

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  ...props
}) => {
  const { submitState } = useContext(MultiSPContext);
  return (
    <Submit {...props} disabled={submitState != "" ? true : false}>
      {submitState != "" ? <Spinner /> : null}
      {submitState != "" ? submitState : text}
    </Submit>
  );
};
