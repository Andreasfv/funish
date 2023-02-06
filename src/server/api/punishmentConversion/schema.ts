import { z } from "zod";

export const createPunishmentConversionSchema = z.object({
  rate: z.number(),
  organizationId: z.string(),
  fromPunishmentTypeId: z.string(),
  toPunishmentTypeId: z.string(),
});

export const updatePunishmentConversionSchema = z.object({
  id: z.string(),
  rate: z.number(),
  fromPunishmentTypeId: z.string(),
  toPunishmentTypeId: z.string(),
});

export const filterPunishmentConversionSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(0),
  filterString: z.string().optional(),
  sort: z.enum(["points", "-points"]).optional(),
});

export const deletePunishmentConversionSchema = z.string();

export const getPunishmentConversionSchema = z.object({ id: z.string() });

export type CreatePunishmentConversionInput = z.infer<
  typeof createPunishmentConversionSchema
>;
export type UpdatePunishmentConversionInput = z.infer<
  typeof updatePunishmentConversionSchema
>;
export type FilterPunishmentConversionInput = z.infer<
  typeof filterPunishmentConversionSchema
>;
export type SortPunishmentConversionsInput = z.infer<
  (typeof filterPunishmentConversionSchema)["shape"]["sort"]
>;
export type DeletePunishmentConversionInput = z.infer<
  typeof deletePunishmentConversionSchema
>;
export type GetPunishmentConversionInput = z.infer<
  typeof getPunishmentConversionSchema
>;
