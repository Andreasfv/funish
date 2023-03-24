import { z } from "zod";

export const createPunishmentReasonSchema = z.object({
  name: z.string(),
  description: z.string(),
  organizationId: z.string(),
});

export const updatePunishmentReasonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  organizationId: z.string(),
});

export const filterPunishmentReasonSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(0),
  filterString: z.string().optional(),
  organizationId: z.string().optional(),
  sort: z.enum(["name", "-name", "description", "-description"]).optional(),
});

export const deletePunishmentReasonSchema = z.string();

export const getPunishmentReasonSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
});

export type CreatePunishmentReasonInput = z.infer<
  typeof createPunishmentReasonSchema
>;
export type UpdatePunishmentReasonInput = z.infer<
  typeof updatePunishmentReasonSchema
>;
export type FilterPunishmentReasonInput = z.infer<
  typeof filterPunishmentReasonSchema
>;
export type SortPunishmentReasonsInput = z.infer<
  (typeof filterPunishmentReasonSchema)["shape"]["sort"]
>;
export type DeletePunishmentReasonInput = z.infer<
  typeof deletePunishmentReasonSchema
>;
export type GetPunishmentReasonInput = z.infer<
  typeof getPunishmentReasonSchema
>;
