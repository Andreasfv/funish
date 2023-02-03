import { Role } from "@prisma/client";
import { z } from "zod";

export const userTypeSchema = z.enum([
  Role.ORG_ADMIN,
  Role.ORG_MEMBER,
  Role.SUPER_ADMIN,
]);

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: userTypeSchema,
  organizationId: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: userTypeSchema.optional(),
  organizationId: z.string().optional(),
});

export const sortUsers = z.enum([
  "name",
  "-name",
  "email",
  "-email",
  "role",
  "-role",
  "organizationId",
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
]);

export const organizationUsersSchema = z.object({
  organizationId: z.string(),
  sort: sortUsers,
});

export const addUserToOrganizationSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type OrganizationUsersInput = z.infer<typeof organizationUsersSchema>;
export type SortUSersInput = z.infer<typeof sortUsers>;
export type AddUserToOrganizationInput = z.infer<
  typeof addUserToOrganizationSchema
>;
export type UserType = z.infer<typeof userTypeSchema>;
