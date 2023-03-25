import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";

import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  FilterOrganizationInput,
} from "./schema";

export const createOrganizationController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateOrganizationInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const organization = await prisma.organization.create({
      data: {
        name: input.name,
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Organization already exists",
        });
      }
    }
    throw error;
  }
};

export const updateOrganizationController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateOrganizationInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (
        session?.user?.organizationId !== input.id &&
        session?.user?.role !== "ORG_ADMIN"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }

    const organization = await prisma.organization.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Organization name already exists",
        });
      }
    }
    throw error;
  }
};

export const getOrganizationsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: FilterOrganizationInput;
}) => {
  try {
    const { prisma } = ctx;
    const { limit, page, filterString } = input;

    const organizations = await prisma.organization.findMany({
      take: limit,
      skip: page * limit,
      where: {
        name: { contains: filterString },
      },
    });

    return {
      status: "success",
      data: {
        organizations,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getOrganizationController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: string;
}) => {
  try {
    const { prisma } = ctx;
    const organization = await prisma.organization.findUnique({
      where: {
        id: input,
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const deleteOrganizationController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: { id: string };
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const organization = await prisma.organization.delete({
      where: {
        id: input.id,
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getMyOrganizationController = async ({
  ctx,
}: {
  ctx: Context;
}) => {
  try {
    const { prisma, session } = ctx;
    if (!session?.user?.organizationId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found from session",
      });
    }

    const organization = await prisma.organization.findUnique({
      where: {
        id: session.user.organizationId,
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getOrganizationWithPunishmentDataController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: string;
}) => {
  try {
    const { prisma, session } = ctx;

    // Permission Handling other than logged in
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (session?.user?.organizationId !== input) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }
    const organization = await prisma.organization.findUnique({
      where: {
        id: input,
      },
      include: {
        punishments: true,
        punishmentTypes: true,
        punishmentReasons: true,
        users: true,
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getOrganizationUsersWithPunishmentDataController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: string;
}) => {
  try {
    const { prisma, session } = ctx;

    // Permission Handling other than logged in
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (session?.user?.organizationId !== input) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }
    const organization = await prisma.organization.findUnique({
      where: {
        id: input,
      },
      include: {
        users: {
          include: {
            punishments: {
              include: {
                type: true,
                reason: true,
                createdBy: true
              }
            },
          },
        },
      },
    });
    return {
      status: "success",
      data: {
        organization,
      },
    };
  } catch (error) {
    throw error;
  }
}