import { TRPCError } from "@trpc/server";
import cloudinary from "cloudinary";
import { env } from "../../../env/server.mjs";
import type { Context } from "../trpc";
import type { GetGalleryImagesInput, UploadImageInput } from "./schema";

export const uploadImageController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UploadImageInput;
}) => {
  const { session } = ctx;
  const { userId, organizationId, image } = input;

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  try {
    cloudinary.v2.config({
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
    const upload = await cloudinary.v2.uploader.upload(image.toString(), {
      public_id: `${userId}/${organizationId}`,
      overwrite: true,
    });

    if (!upload) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    return {
      ok: true,
    };
  } catch {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getGalleryImagesController = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetGalleryImagesInput;
}) => {
  const { prisma } = ctx;
  const { organizationId } = input;

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }
  type CloudinaryResponse = {
    total_count: number;
    resources: {
      public_id: string;
    }[];
  };
  const imagesResponse = await cloudinary.v2.search
    .expression(
      `resource_type:image AND folder="${organization.name}/sp_proof"`
    )
    .max_results(50)
    .execute()
    .then((res: CloudinaryResponse) => {
      return res;
    })
    .catch((err) => console.warn(err));
  if (
    !imagesResponse ||
    !imagesResponse.resources ||
    imagesResponse.total_count == 0
  ) {
    return [];
  }
  const images = imagesResponse.resources.map((image) => image.public_id);
  return images;
};
