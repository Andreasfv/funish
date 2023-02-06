import { z } from "zod";

export const createPunishmentSchema = z.object({
  userId: z.string(),
  createdById: z.string(),
  typeId: z.string(),
  reasonId: z.string(),
  organizationId: z.string(),
  description: z.string(),
  proof: z.string(),
  quantity: z.number(),
  approved: z.boolean().default(false),
});

export const updatePunishmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  typeId: z.string(),
  reasonId: z.string(),
  description: z.string(),
  date: z.string(),
  quantity: z.number(),
  proof: z.string(),
  approved: z.boolean(),
});

//Todo add approved filter
export const filterPunishmentSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(0),
  filterString: z.string().optional(),
  approved: z.boolean().optional(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
  createdById: z.string().optional(),
  sort: z
    .enum([
      "type",
      "-type",
      "date",
      "-date",
      "quantity",
      "-quantity",
      "approved",
      "-approved",
    ])
    .optional(),
});

export const deletePunishmentSchema = z.string();

export const getPunishmentSchema = z.string();

export type CreatePunishmentInput = z.infer<typeof createPunishmentSchema>;
export type UpdatePunishmentInput = z.infer<typeof updatePunishmentSchema>;
export type FilterPunishmentInput = z.infer<typeof filterPunishmentSchema>;
export type SortPunishmentsInput = z.infer<
  (typeof filterPunishmentSchema)["shape"]["sort"]
>;
export type DeletePunishmentInput = z.infer<typeof deletePunishmentSchema>;
export type GetPunishmentInput = z.infer<typeof getPunishmentSchema>;
