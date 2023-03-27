import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

import {
  createPunishmentTypeController,
  deletePunishmentTypeController,
  getPunishmentTypeController,
  getPunishmentTypesController,
  updatePunishmentTypeController,
  getPunishmentTypesWithPunishmentsForUser,
  redeemPunishmentsController,
} from "./controller";

import {
  createPunishmentTypeSchema,
  deletePunishmentTypeSchema,
  filterPunishmentTypeSchema,
  getPunishmentTypeSchema,
  updatePunishmentTypeSchema,
  getPunishmentTypeWithPunishmentsForUserSchema,
  redeemPunishmentsSchema,
} from "./schema";

export const punishmentTypeRouter = createTRPCRouter({
  getPunishmentType: protectedProcedure
    .input(getPunishmentTypeSchema)
    .query(({ ctx, input }) => getPunishmentTypeController({ ctx, input })),

  getPunishmentTypes: protectedProcedure
    .input(filterPunishmentTypeSchema)
    .query(({ ctx, input }) => getPunishmentTypesController({ ctx, input })),

  getPunishmentTypesWithPunishmentsForUser: protectedProcedure
    .input(getPunishmentTypeWithPunishmentsForUserSchema)
    .query(({ ctx, input }) =>
      getPunishmentTypesWithPunishmentsForUser({ ctx, input })
    ),

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

    redeemPunishments: adminProcedure
    .input(redeemPunishmentsSchema)
    .mutation(({ ctx, input }) =>
      redeemPunishmentsController({ ctx, input })
    ),
});
