import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc";

import type {
  CreatePunishmentInput,
  UpdatePunishmentInput,
  FilterPunishmentInput,
  CreateManyPunishmentsInput,
} from "./schema";

export const createPunishmentController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreatePunishmentInput;
}) => {
  try {
    const { prisma, session } = ctx;
    const permissionToApprove =
      session?.user?.role === "ORG_ADMIN" ||
      session?.user?.role === "SUPER_ADMIN";
    const punishment = await prisma.punishment.create({
      data: {
        userId: input.userId,
        createdById: input.createdById,
        typeId: input.typeId,
        reasonId: input.reasonId,
        organizationId: input.organizationId,
        description: input.description,
        proof: input.proof,
        quantity: input.quantity,
        approved: permissionToApprove ? input.approved : false,
      },
    });
    return {
      status: "success",
      data: {
        punishment,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Punishment already exists",
        });
      }
    }
    throw error;
  }
};

export const createManyPunishmentsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateManyPunishmentsInput;
}) => {
  const { prisma, session } = ctx;

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  //Verification? Already verified on the front-end buuut...
  if (input.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No punishments were provided",
    });
  }
  input.forEach((sp, index) => {
    if (!sp.createdById) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `No createdById provided for punishment ${index}`,
      });
    }
    if (!sp.userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `No userId provided for punishment ${index}`,
      });
    }
    if (!sp.typeId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `No typeId provided for punishment ${index}`,
      });
    }
    if (!sp.reasonId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `No reasonId provided for punishment ${index}`,
      });
    }
    if (!sp.organizationId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `No organizationId provided for punishment ${index}`,
      });
    }
    if (Number.isNaN(sp.quantity)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Quantity value for punishment ${index} has to be a number`,
      });
    }
  });

  const ok = await prisma.punishment.createMany({
    data: input,
  });

  if (ok) {
    return {
      status: "success",
    };
  } else {
    return {
      status: "error",
    };
  }
};

export const updatePunishmentController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdatePunishmentInput;
}) => {
  try {
    const { prisma, session } = ctx;
    const punishmentToBeUpdated = await prisma.punishment.findUnique({
      where: { id: input.id },
    });

    if (session?.user?.role !== "ORG_ADMIN" && input.approved === true) {
      if (
        session?.user?.role !== "SUPER_ADMIN" &&
        session?.user?.id !== punishmentToBeUpdated?.createdById
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to approve punishment",
        });
      }
    }
    const punishment = await prisma.punishment.update({
      where: { id: input.id },
      data: {
        userId: input.userId,
        typeId: input.typeId,
        reasonId: input.reasonId,
        description: input.description,
        proof: input.proof,
        quantity: input.quantity,
        approved: input.approved,
      },
    });
    return {
      status: "success",
      data: {
        punishment,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Punishment already exists",
        });
      }
    }
    throw error;
  }
};

export const deletePunishmentController = async ({
  ctx,
  id,
}: {
  ctx: Context;
  id: string;
}) => {
  try {
    const { prisma, session } = ctx;
    const punishment = await prisma.punishment.findUnique({
      where: { id },
    });

    if (
      session?.user?.role !== "ORG_ADMIN" &&
      session?.user?.role !== "SUPER_ADMIN" &&
      session?.user?.id !== punishment?.createdById
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }
    const deletedPunishment = await prisma.punishment.delete({
      where: { id },
    });

    return {
      status: "success",
      data: {
        deletedPunishment,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: FilterPunishmentInput;
}) => {
  try {
    const { prisma, session } = ctx;
    const orderBy: Prisma.Enumerable<Prisma.PunishmentOrderByWithRelationInput> =
      {
        createdAt:
          input.sort === "createdAt"
            ? "asc"
            : input.sort === "-createdAt"
            ? "desc"
            : undefined,
        quantity:
          input.sort === "quantity"
            ? "asc"
            : input.sort === "-quantity"
            ? "desc"
            : undefined,
        approved:
          input.sort === "approved"
            ? "asc"
            : input.sort === "-approved"
            ? "desc"
            : undefined,
      };
    //if not super admin, check if user has permission to view
    if (session?.user?.role !== "SUPER_ADMIN") {
      //user has to be in same organization to be able to view punishments
      if (!input.organizationId && !session?.user?.organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized, you ",
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

    const { cursor } = input;

    const punishment = await prisma.punishment.findMany({
      where: {
        organizationId: input.organizationId
          ? input.organizationId
          : session?.user?.organizationId,
        userId: input.userId,
        approved: input.approved,
        createdById: input.createdById,
        reedemed: input.redeemed,
      },
      include: {
        user: input.including?.user ?? false,
        type: input.including?.type ?? false,
        reason: input.including?.reason ?? false,
        createdBy: input.including?.createdBy ?? false,
      },
      orderBy,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      take: input.limit,
    });
    let nextCursor: typeof cursor | undefined = undefined;
    if (punishment.length >= (input?.limit ? input.limit : 0)) {
      const nextItem = punishment.pop();
      nextCursor = nextItem?.id;
    }
    return {
      status: "success",
      nextCursor,
      punishment,
    };
  } catch (error) {
    throw error;
  }
};

export const getPunishmentController = async ({
  ctx,
  id,
}: {
  ctx: Context;
  id: string;
}) => {
  try {
    const { prisma, session } = ctx;
    const punishment = await prisma.punishment.findUnique({
      where: { id },
    });

    if (
      session?.user?.role !== "SUPER_ADMIN" &&
      session?.user?.organizationId !== punishment?.organizationId
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }
    return {
      status: "success",
      data: {
        punishment,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getMyPunishmentsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: FilterPunishmentInput;
}) => {
  try {
    const { prisma, session } = ctx;
    const orderBy: Prisma.Enumerable<Prisma.PunishmentOrderByWithRelationInput> =
      {
        createdAt:
          input.sort === "type"
            ? "asc"
            : input.sort === "-type"
            ? "desc"
            : undefined,
        quantity:
          input.sort === "quantity"
            ? "asc"
            : input.sort === "-quantity"
            ? "desc"
            : undefined,
        approved:
          input.sort === "approved"
            ? "asc"
            : input.sort === "-approved"
            ? "desc"
            : undefined,
      };

    const punishment = await prisma.punishment.findMany({
      where: {
        organizationId: session?.user?.organizationId,
        userId: session?.user?.id,
        approved: input.approved,
        createdById: input.createdById,
        type: {
          id: input.typeId,
        },
      },
      orderBy,
      take: input.limit,
    });
    return {
      status: "success",
      data: {
        punishment,
      },
    };
  } catch (error) {
    throw error;
  }
};
