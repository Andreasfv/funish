import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  getGalleryImagesController,
  uploadImageController,
} from "./controller";
import { getGalleryImagesSchema, uploadImageSchema } from "./schema";

export const imageRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(uploadImageSchema)
    .mutation(({ ctx, input }) => uploadImageController({ ctx, input })),
  getGalleryImages: protectedProcedure
    .input(getGalleryImagesSchema)
    .query(({ ctx, input }) => getGalleryImagesController({ ctx, input })),
});
