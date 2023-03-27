import { z } from "zod";

export const sortOrganization = z
  .enum(["name", "-name", "orgNumber", "-orgNumber"])
  .optional();

export const createOrganizationSchema = z.object({
  name: z.string(),
});

export const updateOrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const filterOrganizationSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(0),
  filterString: z.string().optional(),
  sort: sortOrganization,
});

export const deleteOrganizationSchema = z.object({
  id: z.string(),
});

export const getOrganizationSchema = z.string();

export const getOrganizationUsersWithPunishmentDataSchema = z.object({
  organizationId: z.string(),
  approved: z.boolean().optional(),
  redeemed: z.boolean().optional(),
})

export type getOrganizationUsersWithPunishmentDataInput = z.infer<typeof getOrganizationUsersWithPunishmentDataSchema>;
export type GetOrganizationInput = z.infer<typeof getOrganizationSchema>;
export type FilterOrganizationInput = z.infer<typeof filterOrganizationSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type SortOrganizationsInput = z.infer<typeof sortOrganization>;
export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;
