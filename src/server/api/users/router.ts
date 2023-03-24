import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import {
  addUserToOrganizationController,
  createUserController,
  getMeController,
  getUserController,
  getOrganizationUsersController,
  getComprehensiveUserDataController,
} from "./controller";

import {
  addUserToOrganizationSchema,
  createUserSchema,
  getUserSchema,
  organizationUsersSchema,
} from "./schema";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => getMeController({ ctx })),
  getOrganizationUsers: protectedProcedure
    .input(organizationUsersSchema)
    .query(({ ctx, input }) => getOrganizationUsersController({ ctx, input })),
  addUserToOrganization: adminProcedure
    .input(addUserToOrganizationSchema)
    .mutation(({ ctx, input }) =>
      addUserToOrganizationController({ ctx, input })
    ),
  createUser: adminProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) => createUserController({ ctx, input })),
  getUser: protectedProcedure
    .input(getUserSchema)
    .query(({ ctx, input }) => getUserController({ ctx, userId: input })),
  getComprehensiveUserData: protectedProcedure
    .input(getUserSchema)
    .query(({ ctx, input }) =>
      getComprehensiveUserDataController({ ctx, input })
    ),
});
