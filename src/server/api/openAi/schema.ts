import { z } from "zod";

export const openAiPromptSchema = z.object({
  prompt: z.string(),
  model: z.string().optional(),
});

export type OpenAiPromptType = z.infer<typeof openAiPromptSchema>;
