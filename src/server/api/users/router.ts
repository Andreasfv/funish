import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import {
  addUserToOrganizationController,
  createUserController,
  getMeController,
  getUserController,
  getOrganizationUsersController,
  getComprehensiveUserDataController,
  updateUserController,
} from "./controller";

import {
  addUserToOrganizationSchema,
  createUserSchema,
  getComprehensiveUserDataSchema,
  getUserSchema,
  organizationUsersSchema,
  updateUserSchema,
} from "./schema";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => getMeController({ ctx })),
  getOrganizationUsers: protectedProcedure
    .input(organizationUsersSchema)
    .query(({ ctx, input }) => getOrganizationUsersController({ ctx, input })),
  addUserToOrganization: publicProcedure
    .input(addUserToOrganizationSchema)
    .mutation(({ ctx, input }) =>
      addUserToOrganizationController({ ctx, input })
    ),
  createUser: adminProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) => createUserController({ ctx, input })),
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(({ ctx, input }) => updateUserController({ ctx, input })),
  getUser: protectedProcedure
    .input(getUserSchema)
    .query(({ ctx, input }) => getUserController({ ctx, userId: input })),
  getComprehensiveUserData: protectedProcedure
    .input(getComprehensiveUserDataSchema)
    .query(({ ctx, input }) =>
      getComprehensiveUserDataController({ ctx, input })
    ),
});
