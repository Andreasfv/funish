import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";

import type {
  CreatePunishmentReasonInput,
  UpdatePunishmentReasonInput,
  FilterPunishmentReasonInput,
} from "./schema";

export const createPunishmentReasonController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreatePunishmentReasonInput;
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

    const punishmentReason = await prisma.punishmentReason.create({
      data: {
        name: input.name,
        description: input.description,
        organizationId: input.organizationId,
      },
    });
    return {
      status: "success",
      data: {
        punishmentReason,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Punishment reason already exists",
        });
      }
    }
    throw error;
  }
};

export const updatePunishmentReasonController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdatePunishmentReasonInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "ORG_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentReason = await prisma.punishmentReason.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
      },
    });
    return {
      status: "success",
      data: {
        punishmentReason,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Punishment reason already exists",
        });
      }
    }
    throw error;
  }
};

export const deletePunishmentReasonController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: string;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "ORG_ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    const punishmentReason = await prisma.punishmentReason.delete({
      where: {
        id: input,
      },
    });
    return {
      status: "success",
      data: {
        punishmentReason,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentReasonsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: FilterPunishmentReasonInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (!input.organizationId && !session?.user?.organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized, not connected to any organization",
        });
      }
      if (
        input.organizationId &&
        session?.user?.organizationId !== input.organizationId
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }

    const punishmentReasons = await prisma.punishmentReason.findMany({
      where: {
        name: { contains: input.filterString },
        organizationId: input.organizationId
          ? input.organizationId
          : session?.user?.organizationId,
      },
    });
    return {
      status: "success",
      data: {
        punishmentReasons,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentReasonController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: { id: string };
}) => {
  try {
    const { prisma, session } = ctx;
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (!session?.user?.organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized, not connected to any organization",
        });
      }
    }

    const punishmentReason = await prisma.punishmentReason.findUnique({
      where: {
        id: input.id,
      },
    });

    if (punishmentReason?.organizationId !== session?.user?.organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

    return {
      status: "success",
      data: {
        punishmentReason,
      },
    };
  } catch (error) {
    throw error;
  }
};
