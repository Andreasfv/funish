import type { Context } from "../trpc";

import { Configuration, OpenAIApi } from "openai";
import { env } from "../../../env/server.mjs";
import { OpenAiPromptType } from "./schema.js";

const configuration = new Configuration({
  apiKey: env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);
export const openAIPromptController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: OpenAiPromptType;
}) => {
  const { prompt, model } = input;

  const response = await openai.createCompletion({
    model: model ?? "text-davinci-003",
    prompt: prompt,
    max_tokens: 64,
    temperature: 0.7,
    n: 1,
  });

  response.data.choices;

  return response.data.choices[0];
};
