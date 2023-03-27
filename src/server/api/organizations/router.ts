import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../trpc";
import {
  getOrganizationsController,
  getMyOrganizationController,
  getOrganizationController,
  createOrganizationController,
  updateOrganizationController,
  deleteOrganizationController,
  getOrganizationWithPunishmentDataController,
  getOrganizationUsersWithPunishmentDataController
} from "./controller";
import {
  getOrganizationSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  filterOrganizationSchema,
  deleteOrganizationSchema,
  getOrganizationUsersWithPunishmentDataSchema,
} from "./schema";

export const organizationsRouter = createTRPCRouter({
  getOrganization: protectedProcedure
    .input(getOrganizationSchema)
    .query(({ ctx, input }) => getOrganizationController({ ctx, input })),
  getOrganizations: protectedProcedure
    .input(filterOrganizationSchema)
    .query(({ ctx, input }) => getOrganizationsController({ ctx, input })),
  getOrganizationWithPunishmentData: protectedProcedure
    .input(getOrganizationSchema)
    .query(({ ctx, input }) =>
      getOrganizationWithPunishmentDataController({ ctx, input })
    ),
  getOrganizationUsersWithPunishmentData: protectedProcedure
    .input(getOrganizationUsersWithPunishmentDataSchema)
    .query(({ ctx, input }) =>
      getOrganizationUsersWithPunishmentDataController({ ctx, input })
    ),

  getMyOrganization: protectedProcedure.query(({ ctx }) =>
    getMyOrganizationController({ ctx })
  ),
  createOrganization: superAdminProcedure
    .input(createOrganizationSchema)
    .mutation(({ ctx, input }) => createOrganizationController({ ctx, input })),
  updateOrganization: adminProcedure
    .input(updateOrganizationSchema)
    .mutation(({ ctx, input }) => updateOrganizationController({ ctx, input })),
  deleteOrganizationController: adminProcedure
    .input(deleteOrganizationSchema)
    .mutation(({ ctx, input }) => deleteOrganizationController({ ctx, input })),
});
