import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";

import type {
  CreatePunishmentConversionInput,
  UpdatePunishmentConversionInput,
  FilterPunishmentConversionInput,
  GetPunishmentConversionInput,
} from "./schema";

// Should be able to be created for organizations by organization admins and for everyone
// by superadmin
export const createPunishmentConversionController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreatePunishmentConversionInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (
        session?.user?.organizationId !== input.organizationId &&
        session?.user?.role !== "ORG_ADMIN"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }

    const punishmentConversion = await prisma.punishmentConversion.create({
      data: {
        rate: input.rate,
        organizationId: input.organizationId,
        fromId: input.fromPunishmentTypeId,
        toId: input.toPunishmentTypeId,
      },
    });
    return {
      status: "success",
      data: {
        punishmentConversion,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Punishment Conversion already exists",
        });
      }
    }
    throw error;
  }
};

// Should be able to be updated for organizations by organization admins and for everyone
// by superadmin
export const updatePunishmentConversionController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdatePunishmentConversionInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (
      session?.user?.role !== "SUPER_ADMIN" &&
      session?.user?.role !== "ORG_ADMIN"
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentConversion = await prisma.punishmentConversion.update({
      where: {
        id: input.id,
      },
      data: {
        rate: input.rate,
        fromId: input.fromPunishmentTypeId,
        toId: input.toPunishmentTypeId,
      },
    });

    if (
      session?.user?.role === "ORG_ADMIN" &&
      session?.user?.organizationId !== punishmentConversion.organizationId
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    return {
      status: "success",
      data: {
        punishmentConversion,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const deletePunishmentConversionController = async ({
  ctx,
  id,
}: {
  ctx: Context;
  id: string;
}) => {
  try {
    const { prisma, session } = ctx;
    if (
      session?.user?.role !== "ORG_ADMIN" &&
      session?.user?.role !== "SUPER_ADMIN"
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentConversion = await prisma.punishmentConversion.delete({
      where: {
        id,
      },
    });
    return {
      status: "success",
      data: {
        punishmentConversion,
      },
    };
  } catch (error) {
    throw error;
  }
};
//TODO add fetch for admin? Select organization manually rather than from session?
export const getPunishmentConversionsController = async ({
  ctx,
}: {
  ctx: Context;
  input: FilterPunishmentConversionInput;
}) => {
  try {
    const { prisma, session } = ctx;

    const punishmentConversions = await prisma.punishmentConversion.findMany({
      where: {
        organizationId: session?.user?.organizationId,
      },
    });

    return {
      status: "success",
      data: {
        punishmentConversions,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentConversionController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetPunishmentConversionInput;
}) => {
  try {
    const { prisma, session } = ctx;

    const punishmentConversion = await prisma.punishmentConversion.findUnique({
      where: {
        id: input.id,
      },
    });

    if (
      session?.user?.role === "ORG_ADMIN" &&
      session?.user?.organizationId !== punishmentConversion?.organizationId
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }
    return {
      status: "success",
      data: {
        punishmentConversion,
      },
    };
  } catch (error) {
    throw error;
  }
};
