import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.green};
  gap: 1rem;
`;

const MessageWrapper = styled.div`
  min-height: 2.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.green};
  background-color: ${(props) => props.theme.colors.lightGreen};
`;

const AnswerWrapper = styled.div``;
interface MessageProps {
  message: string;
  answer: string;
}

export const Message: React.FC<MessageProps> = ({ message, answer }) => {
  return (
    <Wrapper>
      <MessageWrapper>{message}</MessageWrapper>
      <AnswerWrapper>{answer}</AnswerWrapper>
    </Wrapper>
  );
};
