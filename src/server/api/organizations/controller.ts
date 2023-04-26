import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";
import type {
  KSGInternalGangsResponse,
  KSGInternalGroupResponse,
} from "../../ksgQueries";
import {
  KSG_NETT_HOVMESTER_QUERY,
  KSG_NETT_INTERNAL_GANGS_QUERY,
} from "../../ksgQueries";
import type { Context } from "../trpc";

import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  FilterOrganizationInput,
  getOrganizationUsersWithPunishmentDataInput,
  getOrganizationWithPunishmentDataInput,
  PopulateOrganizationWithUsersFromKSGNettInput,
  TransferAdminRightsInput,
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

export const organizationExists = async ({
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
    if (organization) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
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
  input: getOrganizationWithPunishmentDataInput;
}) => {
  try {
    const { prisma, session } = ctx;

    // Permission Handling other than logged in
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (session?.user?.organizationId !== input.organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }
    const organization = await prisma.organization.findUnique({
      where: {
        id: input.organizationId,
      },
      include: {
        punishments: {
          where: {
            approved: input.approved,
            reedemed: input.redeemed,
          },
        },
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
  input: getOrganizationUsersWithPunishmentDataInput;
}) => {
  try {
    const { prisma, session } = ctx;

    // Permission Handling other than logged in
    if (session?.user?.role !== "SUPER_ADMIN") {
      if (session?.user?.organizationId !== input.organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }
    }
    const organization = await prisma.organization.findUnique({
      where: {
        id: input.organizationId,
      },
      select: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
            receivedPunishments: {
              where: {
                approved: input.approved,
                reedemed: input.redeemed,
              },
              select: {
                id: true,
                type: true,
                reason: true,
                user: true,
                createdBy: true,
                approved: true,
                quantity: true,
                reedemed: true,
              },
            },
          },
        },
      },
    });
    return {
      status: "success",
      organization,
    };
  } catch (error) {
    throw error;
  }
};

export const populateOrganizationWithUsersFromKSGNettController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: PopulateOrganizationWithUsersFromKSGNettInput;
}) => {
  const { prisma, session } = ctx;
  const { organizationId, ksgGangName } = input;
  const internalGangsResponse = await fetch(env.KSG_NETT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.ksgNettToken ?? ""}`,
    },
    body: JSON.stringify({
      query: KSG_NETT_INTERNAL_GANGS_QUERY,
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const internalGangsData: KSGInternalGangsResponse =
    await internalGangsResponse.json();

  let internalGangId = "";
  //This is janky as shits, but I couldn't be arsed to download KSG-nett or find their dev-graphql endpoint and figure it out.
  //TODO UNJANK THIS SHIT
  for (const gang of internalGangsData?.data?.internalGroups) {
    console.log(gang.name);
    if (gang.name.toLowerCase() === ksgGangName.toLowerCase()) {
      internalGangId = gang.id;
    }
  }

  const response = await fetch(env.KSG_NETT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.ksgNettToken ?? ""}`,
    },
    body: JSON.stringify({
      query: KSG_NETT_HOVMESTER_QUERY,
      variables: {
        id: internalGangId,
      },
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: KSGInternalGroupResponse = await response.json();
  const funkeGjenger = {
    "Lyche Bar": "Hovmester",
    Styret: true,
  };
  for (const group of data?.data?.internalGroup?.membershipData) {
    console.log(group.internalGroupPositionName);
    if (
      group.internalGroupPositionName ==
        funkeGjenger[ksgGangName as keyof typeof funkeGjenger] ||
      funkeGjenger[ksgGangName as keyof typeof funkeGjenger] === true
    ) {
      for (const member of group.users) {
        await prisma.user
          .upsert({
            where: {
              email: member.email,
            },
            update: {
              id: member.id,
              name: member.fullName,
              image: member.profileImage,
              email: member.email,
              organizationId: organizationId,
            },
            create: {
              id: member.id,
              name: member.fullName,
              image: member.profileImage,
              email: member.email,
              role: "ORG_MEMBER",
              organizationId: organizationId,
            },
          })
          .catch(() => {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
            });
          });
      }
    }
  }

  return {
    ok: true,
  };
};

export const transferAdminRightsController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: TransferAdminRightsInput;
}) => {
  const { prisma, session } = ctx;
  const { organizationId, targetUserId, fromUserId } = input;
  if (
    session?.user?.role !== "ORG_ADMIN" &&
    session?.user?.role !== "SUPER_ADMIN"
  ) {
    if (session?.user?.organizationId !== organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }
  }

  if (
    session?.user?.id !== fromUserId &&
    session?.user?.role !== "SUPER_ADMIN"
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized",
    });
  }

  if (session?.user?.role === "SUPER_ADMIN") {
    await prisma.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        role: "ORG_ADMIN",
      },
    });

    return {
      ok: true,
    };
  }

  await prisma.user.update({
    where: {
      id: fromUserId,
    },
    data: {
      role: "ORG_MEMBER",
    },
  });

  await prisma.user.update({
    where: {
      id: targetUserId,
    },
    data: {
      role: "ORG_ADMIN",
    },
  });

  return {
    ok: true,
  };
};
