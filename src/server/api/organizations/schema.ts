import { z } from "zod";

export const sortOrganization = z
  .enum(["name", "-name", "orgNumber", "-orgNumber"])
  .optional();

export const sortOrganizationUser = z.enum([
  "name",
  "-name",
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
  "spCount",
  "-spCount",
  "unapprovedSPCount",
  "-unapprovedSPCount",
]);
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

export const getOrganizationWithPunishmentDataSchema = z.object({
  organizationId: z.string(),
  approved: z.boolean().optional(),
  redeemed: z.boolean().optional(),
});

export const getOrganizationUsersWithPunishmentDataSchema = z.object({
  organizationId: z.string(),
  approved: z.boolean().optional(),
  redeemed: z.boolean().optional(),
  orderBy: sortOrganizationUser,
});

export const populateOrganizationWithUsersFromKSGNettInput = z.object({
  organizationId: z.string(),
  ksgGangName: z.string(),
});

export const transferAdminRightsSchema = z.object({
  organizationId: z.string(),
  targetUserId: z.string(),
  fromUserId: z.string(),
});
export type getOrganizationUsersWithPunishmentDataInput = z.infer<
  typeof getOrganizationUsersWithPunishmentDataSchema
>;
export type getOrganizationWithPunishmentDataInput = z.infer<
  typeof getOrganizationWithPunishmentDataSchema
>;
export type GetOrganizationInput = z.infer<typeof getOrganizationSchema>;
export type FilterOrganizationInput = z.infer<typeof filterOrganizationSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type SortOrganizationsInput = z.infer<typeof sortOrganization>;
export type SortOrganizationUserInput = z.infer<typeof sortOrganizationUser>;
export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;
export type PopulateOrganizationWithUsersFromKSGNettInput = z.infer<
  typeof populateOrganizationWithUsersFromKSGNettInput
>;
export type TransferAdminRightsInput = z.infer<
  typeof transferAdminRightsSchema
>;
