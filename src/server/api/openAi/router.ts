import { createTRPCRouter, protectedProcedure } from "../trpc";
import { openAIPromptController } from "./controller";
import { openAiPromptSchema } from "./schema";

export const openaiRouter = createTRPCRouter({
  openAiPrompt: protectedProcedure
    .input(openAiPromptSchema)
    .mutation(({ ctx, input }) => openAIPromptController({ ctx, input })),
});
