import { TRPCError } from "@trpc/server";
import cloudinary from "cloudinary";
import { env } from "../../../env/server.mjs";
import type { Context } from "../trpc";
import type { UploadImageInput } from "./schema";

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
