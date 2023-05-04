import { createTRPCRouter, protectedProcedure } from "../trpc";

import {
  createManyPunishmentsController,
  createPunishmentController,
  deletePunishmentController,
  getPunishmentController,
  getPunishmentsController,
  updatePunishmentController,
} from "./controller";

import {
  createManyPunishmentsSchema,
  createPunishmentSchema,
  deletePunishmentSchema,
  filterPunishmentSchema,
  getPunishmentSchema,
  updatePunishmentSchema,
} from "./schema";

export const punishmentRouter = createTRPCRouter({
  getPunishment: protectedProcedure
    .input(getPunishmentSchema)
    .query(({ ctx, input }) => getPunishmentController({ ctx, id: input })),

  getPunishments: protectedProcedure
    .input(filterPunishmentSchema)
    .query(({ ctx, input }) => getPunishmentsController({ ctx, input })),

  createPunishment: protectedProcedure
    .input(createPunishmentSchema)
    .mutation(({ ctx, input }) => createPunishmentController({ ctx, input })),

  createManyPunishments: protectedProcedure
    .input(createManyPunishmentsSchema)
    .mutation(({ ctx, input }) =>
      createManyPunishmentsController({ ctx, input })
    ),

  updatePunishment: protectedProcedure
    .input(updatePunishmentSchema)
    .mutation(({ ctx, input }) => updatePunishmentController({ ctx, input })),

  deletePunishment: protectedProcedure
    .input(deletePunishmentSchema)
    .mutation(({ ctx, input }) =>
      deletePunishmentController({ ctx, id: input })
    ),
});
