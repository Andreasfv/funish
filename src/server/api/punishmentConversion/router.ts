import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../trpc";

// Creating, editing and updating punisment conversions are available to superusers and
// admins of the organization that the punishment conversion is associated with.

import {
  createPunishmentConversionController,
  deletePunishmentConversionController,
  getPunishmentConversionController,
  getPunishmentConversionsController,
  updatePunishmentConversionController,
} from "./controller";

import {
  createPunishmentConversionSchema,
  deletePunishmentConversionSchema,
  filterPunishmentConversionSchema,
  getPunishmentConversionSchema,
  updatePunishmentConversionSchema,
} from "./schema";

export const punishmentConversionRouter = createTRPCRouter({
  getPunishmentConversion: protectedProcedure
    .input(getPunishmentConversionSchema)
    .query(({ ctx, input }) =>
      getPunishmentConversionController({ ctx, input })
    ),
  getPunishmentConversions: protectedProcedure
    .input(filterPunishmentConversionSchema)
    .query(({ ctx, input }) =>
      getPunishmentConversionsController({ ctx, input })
    ),
  createPunishmentConversion: protectedProcedure
    .input(createPunishmentConversionSchema)
    .mutation(({ ctx, input }) =>
      createPunishmentConversionController({ ctx, input })
    ),
  updatePunishmentConversion: protectedProcedure
    .input(updatePunishmentConversionSchema)
    .mutation(({ ctx, input }) =>
      updatePunishmentConversionController({ ctx, input })
    ),
  deletePunishmentConversion: protectedProcedure
    .input(deletePunishmentConversionSchema)
    .mutation(({ ctx, input }) =>
      deletePunishmentConversionController({ ctx, id: input })
    ),
});
