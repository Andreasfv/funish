import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../trpc";
import { uploadImageController } from "./controller";
import { uploadImageSchema } from "./schema";

export const imageRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(uploadImageSchema)
    .mutation(({ ctx, input }) => uploadImageController({ ctx, input })),
});
