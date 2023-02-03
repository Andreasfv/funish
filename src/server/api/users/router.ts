import { fromPromise } from "@apollo/client";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../trpc";
import {
  addUserToOrganizationController,
  createUserController,
  getMeController,
  getOrganizationUsersController,
} from "./controller";

import {
  addUserToOrganizationSchema,
  createUserSchema,
  organizationUsersSchema,
} from "./schema";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => getMeController({ ctx })),
  getOrganizationUsers: protectedProcedure
    .input(organizationUsersSchema)
    .query(({ ctx, input }) => getOrganizationUsersController({ ctx, input })),
  addUserToOrganization: superAdminProcedure
    .input(addUserToOrganizationSchema)
    .mutation(({ ctx, input }) =>
      addUserToOrganizationController({ ctx, input })
    ),
  createUser: adminProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) => createUserController({ ctx, input })),
});
