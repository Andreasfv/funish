import { createTRPCRouter, protectedProcedure } from "../trpc";

import {
  createPunishmentTypeController,
  deletePunishmentTypeController,
  getPunishmentTypeController,
  getPunishmentTypesController,
  updatePunishmentTypeController,
} from "./controller";

import {
  createPunishmentTypeSchema,
  deletePunishmentTypeSchema,
  filterPunishmentTypeSchema,
  getPunishmentTypeSchema,
  updatePunishmentTypeSchema,
} from "./schema";

export const punishmentTypeRouter = createTRPCRouter({
  getPunishmentType: protectedProcedure
    .input(getPunishmentTypeSchema)
    .query(({ ctx, input }) => getPunishmentTypeController({ ctx, input })),

  getPunishmentTypes: protectedProcedure
    .input(filterPunishmentTypeSchema)
    .query(({ ctx, input }) => getPunishmentTypesController({ ctx, input })),

  createPunishmentType: protectedProcedure
    .input(createPunishmentTypeSchema)
    .mutation(({ ctx, input }) =>
      createPunishmentTypeController({ ctx, input })
    ),

  updatePunishmentType: protectedProcedure
    .input(updatePunishmentTypeSchema)
    .mutation(({ ctx, input }) =>
      updatePunishmentTypeController({ ctx, input })
    ),

  deletePunishmentType: protectedProcedure
    .input(deletePunishmentTypeSchema)
    .mutation(({ ctx, input }) =>
      deletePunishmentTypeController({ ctx, input })
    ),
});
