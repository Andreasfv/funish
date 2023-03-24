import {
  FieldValues,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.green};
  :focus-within {
    outline: ${(props) => props.theme.colors.darkGreen};
    border-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

const BaseInput = styled.input`
  height: 2.5rem;
  padding: 0rem 0.5rem;
  ::placeholder {
    margin-left: 1rem;
  }
  :focus {
    outline: ${(props) => props.theme.colors.darkGreen};
    border-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

interface FormInputProps {
  id: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  required: boolean;
  min?: number;
  max?: number;
}
const FormNumberInput: React.FC<FormInputProps> = ({
  register,
  id,
  required,
  placeholder,
  min,
  max,
}) => {
  return (
    <Wrapper>
      <BaseInput
        {...register}
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </Wrapper>
  );
};

export default FormNumberInput;
