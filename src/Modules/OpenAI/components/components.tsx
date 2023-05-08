import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
`;
export const InputWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

export const QuestionInput = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.green};
`;

export const SubmitButton = styled.button`
  width: 100%;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.green};
`;

export const SubmitWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;
