import styled from "styled-components";

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
  label {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    color: ${(props) => props.theme.colors.gray5};
  }
`;

export default FormField;
