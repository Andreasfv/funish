import { z } from "zod";

export const uploadImageSchema = z.object({
  image: z.string(),
  userId: z.string(),
  organizationId: z.string(),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
