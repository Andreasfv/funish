import { Prisma } from "@prisma/client";
import { contextProps } from "@trpc/react-query/shared";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";

import type {
  CreatePunishmentTypeInput,
  UpdatePunishmentTypeInput,
  SortPunishmentTypesInput,
  FilterPunishmentTypeInput,
  GetPunishmentTypeInput,
} from "./schema";

export const createPunishmentTypeController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreatePunishmentTypeInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "ORG_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentType = await prisma.punishmentType.create({
      data: {
        name: input.name,
        description: input.description,
        organizationId: input.organizationId,
        quantityToFulfill: input.quantityToFulfill,
      },
    });
    return {
      status: "success",
      data: {
        punishmentType,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "PunishmentType already exists",
        });
      }
    }
    throw error;
  }
};

export const updatePunishmentTypeController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdatePunishmentTypeInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "ORG_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentType = await prisma.punishmentType.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        organizationId: input.organizationId,
        quantityToFulfill: input.quantityToFulfill,
      },
    });
    return {
      status: "success",
      data: {
        punishmentType,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "PunishmentType already exists",
        });
      }
    }
    throw error;
  }
};

export const deletePunishmentTypeController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetPunishmentTypeInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "ORG_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentType = await prisma.punishmentType.delete({
      where: { id: input },
    });
    return {
      status: "success",
      data: {
        punishmentType,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentTypeController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetPunishmentTypeInput;
}) => {
  try {
    const { prisma, session } = ctx;

    const punishmentType = await prisma.punishmentType.findUnique({
      where: { id: input },
    });
    return {
      status: "success",
      data: {
        punishmentType,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentTypesController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: FilterPunishmentTypeInput;
}) => {
  try {
    const { prisma, session } = ctx;
    const { filterString, page, limit } = input;
    if (!session?.user?.organizationId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Organization membership not found, or you are not a member of an organization",
      });
    }
    const punishmentTypes = await prisma.punishmentType.findMany({
      where: {
        name: { contains: filterString, mode: "insensitive" },
        organizationId: session?.user?.organizationId,
      },
      skip: page * limit,
      take: limit,
    });
    return {
      status: "success",
      data: {
        punishmentTypes,
      },
    };
  } catch (error) {
    throw error;
  }
};
