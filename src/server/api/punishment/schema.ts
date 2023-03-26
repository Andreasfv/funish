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
  userId: z.string().optional(),
  typeId: z.string().optional(),
  reasonId: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  quantity: z.number().optional(),
  proof: z.string().optional(),
  approved: z.boolean().optional(),
});

//Todo add approved filter
export const filterPunishmentSchema = z.object({
  limit: z.number().optional(),
  cursor: z.string().nullish(),
  filterString: z.string().optional(),
  approved: z.boolean().optional(),
  organizationId: z.string().optional(),
  typeId: z.string().optional(),
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
  including: z.object({
    type: z.boolean().default(false),
    reason: z.boolean().default(false),
    user: z.boolean().default(false),
    createdBy: z.boolean().default(false),
  }).optional()
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
