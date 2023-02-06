import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { usersRouter } from "./users/router";
import { organizationsRouter } from "./organizations/router";
import { punishmentConversionRouter } from "./punishmentConversion/router";
import { punishmentReasonRouter } from "./punishmentReason/router";
import { punishmentTypeRouter } from "./punishmentType/router";
import { punishmentRouter } from "./punishment/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: usersRouter,
  organizations: organizationsRouter,
  punishmentConversions: punishmentConversionRouter,
  punishmentReasons: punishmentReasonRouter,
  punishmentTypes: punishmentTypeRouter,
  punishments: punishmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
