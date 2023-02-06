import { fromPromise } from "@apollo/client";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../trpc";

import {
  createPunishmentReasonController,
  deletePunishmentReasonController,
  getPunishmentReasonController,
  getPunishmentReasonsController,
  updatePunishmentReasonController,
} from "./controller";

import {
  createPunishmentReasonSchema,
  deletePunishmentReasonSchema,
  filterPunishmentReasonSchema,
  getPunishmentReasonSchema,
  updatePunishmentReasonSchema,
} from "./schema";

export const punishmentReasonRouter = createTRPCRouter({
  getPunishmentReason: protectedProcedure
    .input(getPunishmentReasonSchema)
    .query(({ ctx, input }) => getPunishmentReasonController({ ctx, input })),

  getPunishmentReasons: protectedProcedure
    .input(filterPunishmentReasonSchema)
    .query(({ ctx, input }) => getPunishmentReasonsController({ ctx, input })),

  createPunishmentReason: protectedProcedure
    .input(createPunishmentReasonSchema)
    .mutation(({ ctx, input }) =>
      createPunishmentReasonController({ ctx, input })
    ),

  updatePunishmentReason: protectedProcedure
    .input(updatePunishmentReasonSchema)
    .mutation(({ ctx, input }) =>
      updatePunishmentReasonController({ ctx, input })
    ),

  deletePunishmentReason: protectedProcedure
    .input(deletePunishmentReasonSchema)
    .mutation(({ ctx, input }) =>
      deletePunishmentReasonController({ ctx, input })
    ),
});
