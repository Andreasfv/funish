import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import Spinner from "../../../components/Spiner";
import { api } from "../../../utils/api";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import { Message } from "../components";
import {
  ContentWrapper,
  InputWrapper,
  QuestionInput,
  SubmitButton,
  SubmitWrapper,
  Wrapper,
} from "../components/components";

type OpenAIMessages = {
  message: string;
  answer: string;
};
export const ChatBot: React.FC = () => {
  const [messages, setMessates] = useState<OpenAIMessages[]>([]);
  const [prompt, setPrompt] = useState("");

  const { mutate: getResponse, isLoading } =
    api.openAi.openAiPrompt.useMutation({});
  function handlePromptChange(event: ChangeEvent<HTMLInputElement>) {
    setPrompt(event.target.value);
  }
  function handleGetPrompt() {
    getResponse(
      { prompt },
      {
        onSuccess(data) {
          if (data && data.text) {
            console.log(data);
            setMessates((messages) => [
              ...messages,
              {
                message: prompt,
                answer: data.text ?? "",
              },
            ]);
          }
        },
      }
    );
  }

  return (
    <BasePageLayout>
      <Wrapper>
        <ContentWrapper>
          <InputWrapper>
            <QuestionInput
              type="text"
              value={prompt}
              onChange={handlePromptChange}
            />
            <SubmitWrapper>
              {isLoading ? (
                <Spinner />
              ) : (
                <SubmitButton onClick={handleGetPrompt}>Spør!</SubmitButton>
              )}
            </SubmitWrapper>
          </InputWrapper>
          {messages.reverse().map((message, index) => {
            return (
              <Message
                key={index}
                message={message.message}
                answer={message.answer}
              />
            );
          })}
        </ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};
