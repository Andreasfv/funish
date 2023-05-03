import { z } from "zod";

export const uploadImageSchema = z.object({
  image: z.string(),
  userId: z.string(),
  organizationId: z.string(),
});

export const getGalleryImagesSchema = z.object({
  organizationId: z.string(),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type GetGalleryImagesInput = z.infer<typeof getGalleryImagesSchema>;
