import styled from "styled-components";

const SubmitButton = styled.button`
  width: 100%;
  height: 2.5rem;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.green};

  :hover {
    border: 2px solid ${(props) => props.theme.colors.darkGreen};
  }

  :focus {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

export default SubmitButton;
