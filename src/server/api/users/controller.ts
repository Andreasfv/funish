import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";
import type {
  AddUserToOrganizationInput,
  CreateUserInput,
  GetComprehensiveUserDataInput,
  GetUserInput,
  OrganizationUsersInput,
} from "./schema";

// export const createOrganizationController = async ({
//   ctx,
//   input,
// }: {
//   ctx: Context;
//   input: CreateUserInput;
// }) => {
//   try {
//     const { prisma } = ctx;

//     const user = await prisma.user.create({
//       data: {
//         name: input.name,
//         email: input.email,
//         role: input.role,
//         organizationId: input.organizationId,
//       },
//     });
//     return {
//       status: "success",
//       data: {
//         user,
//       },
//     };
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2002") {
//         throw new TRPCError({
//           code: "CONFLICT",
//           message: "Email already exists",
//         });
//       }
//     }
//     throw error;
//   }
// };

export const getMeController = async ({ ctx }: { ctx: Context }) => {
  try {
    const { prisma, session } = ctx;

    if (!session?.user?.id) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getOrganizationUsersController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: OrganizationUsersInput;
}) => {
  try {
    const { prisma } = ctx;
    const { organizationId } = input;

    if (!organizationId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }
    if (ctx.session?.user.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to perform this action",
      });
    }

    const orderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> = {
      name:
        input.sort === "name"
          ? "asc"
          : input.sort === "-name"
          ? "desc"
          : undefined,
      email:
        input.sort === "email"
          ? "asc"
          : input.sort === "-email"
          ? "desc"
          : undefined,
      role:
        input.sort === "role"
          ? "asc"
          : input.sort === "-role"
          ? "desc"
          : undefined,
      organizationId: input.sort === "organizationId" ? "asc" : undefined,
    };

    const users = await prisma.user.findMany({
      where: {
        organizationId,
      },
      orderBy,
    });

    return {
      status: "success",
      data: {
        users,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const createUserController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateUserInput;
}) => {
  try {
    const { prisma, session } = ctx;

    if (session?.user.role !== "SUPER_ADMIN") {
      if (session?.user.organizationId !== input.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this",
        });
      }
    }

    const user = await prisma.user.create({
      data: input,
    });

    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }
    }
    throw error;
  }
};

export const getUserController = async ({
  ctx,
  userId,
}: {
  ctx: Context;
  userId: string;
}) => {
  try {
    const { prisma } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const addUserToOrganizationController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: AddUserToOrganizationInput;
}) => {
  try {
    const { prisma } = ctx;
    const { userId, organizationId } = input;

    if (!organizationId || !userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization or user not found",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        organizationId,
      },
    });

    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getComprehensiveUserDataController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetComprehensiveUserDataInput;
}) => {
  try {
    const { prisma } = ctx;

    if (!input) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      include: {
        organization: {
          include: {
            punishmentTypes: {
              include: {
                Punishments: {
                  where: {
                    userId: input.userId,
                    approved: input.where?.approved,
                    reedemed: input.where?.redeemed
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    throw error;
  }
};
