import type { Punishment } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";

import type {
  CreatePunishmentTypeInput,
  UpdatePunishmentTypeInput,
  FilterPunishmentTypeInput,
  GetPunishmentTypeInput,
  GetPunishmentTypeWithPunishmentsForUserInput,
  RedeemPunishmentsInput,
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
    if (
      session?.user?.role !== "ORG_ADMIN" &&
      session?.user?.role !== "SUPER_ADMIN"
    ) {
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
    if (
      session?.user?.role !== "ORG_ADMIN" &&
      session?.user?.role !== "SUPER_ADMIN"
    ) {
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
    const { prisma } = ctx;

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
        name: { contains: filterString },
        organizationId: input.organizationId,
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

export const getPunishmentTypesWithPunishmentsForUser = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetPunishmentTypeWithPunishmentsForUserInput;
}) => {
  try {
    const { prisma, session } = ctx;
    if (!session?.user?.organizationId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Organization membership not found, or you are not a member of an organization",
      });
    }
    const punishmentTypes = await prisma.punishmentType.findMany({
      where: {
        organizationId: input.organizationId,
      },
      include: {
        Punishments: {
          where: {
            userId: input.userId,
            reedemed: input.redeemed,
            approved: input.approved,
          },
          include: {
            createdBy: true,
            reason: true,
          },
        },
      },
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

export const redeemPunishmentsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: RedeemPunishmentsInput
}) => {
  try {
    const { prisma, session } = ctx;
    if (!session?.user?.organizationId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Organization membership not found, or you are not a member of an organization",
      });
    }
    const punishmentType = await prisma.punishmentType.findUnique({
      where: {
            id: input.punishmentTypeId,
      },
      include: {
        Punishments: {
          where: {
            userId: input.userId,
            approved: true,
          },
          include: {
            createdBy: true,
            reason: true,
          },
          orderBy: {
            createdAt: "desc"
          }
        },
      },
    });

    const punishmentsToRedeem: Punishment[] = []
    console.log("IM Fired")
    if (punishmentType?.Punishments && punishmentType.Punishments.length > 0) {
      const {Punishments: punishments} = punishmentType 

      const punishmentQuantity = punishments?.reduce(
        (acc, cur) => acc + (cur?.approved ?? false ? (cur?.quantity ?? 0) : 0), 
      0)

      if (punishmentQuantity < input.quantity) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Not enough punishments to redeem",
        });
      }

      let punishmentQuota = input.quantity
      punishments.forEach((punishment) => {
        if (punishmentQuota > 0) {
          if (punishment.quantity <= punishmentQuota) {
            punishmentsToRedeem.push(punishment)
            punishmentQuota -= punishment.quantity
          } else {
            prisma.punishment.update({
              where: {
                id: punishment.id
              },
              data: {
                quantity: punishment.quantity - punishmentQuota
              }
            }).catch((err: Error) => {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: err.message,
              });
            })
            punishmentQuota = 0;
            return;
          }
        }
      })
      } else {
        if (!punishmentType?.Punishments) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No punishments to redeem",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Not enough punishments to redeem",
        });
      }

      await prisma.punishment.updateMany({
        where: {
          id: {
            in: punishmentsToRedeem.map((punishment) => punishment.id)
          }
        },
        data: {
          reedemed: true
        }
      })

    return {
      status: "success",
    }
  } catch (error) {
    throw error;
  }
}

