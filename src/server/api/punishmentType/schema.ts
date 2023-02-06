import { z } from "zod";

export const createPunishmentTypeSchema = z.object({
  name: z.string(),
  description: z.string(),
  organizationId: z.string(),
  quantityToFulfill: z.number(),
});

export const updatePunishmentTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  organizationId: z.string(),
  quantityToFulfill: z.number(),
});

export const filterPunishmentTypeSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(0),
  filterString: z.string().optional(),
  sort: z.enum(["name", "-name", "description", "-description"]).optional(),
});

export const deletePunishmentTypeSchema = z.string();

export const getPunishmentTypeSchema = z.string();

export type CreatePunishmentTypeInput = z.infer<
  typeof createPunishmentTypeSchema
>;
export type UpdatePunishmentTypeInput = z.infer<
  typeof updatePunishmentTypeSchema
>;
export type FilterPunishmentTypeInput = z.infer<
  typeof filterPunishmentTypeSchema
>;
export type SortPunishmentTypesInput = z.infer<
  (typeof filterPunishmentTypeSchema)["shape"]["sort"]
>;
export type DeletePunishmentTypeInput = z.infer<
  typeof deletePunishmentTypeSchema
>;
export type GetPunishmentTypeInput = z.infer<typeof getPunishmentTypeSchema>;
