import { testRouter } from './routers/test';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  //insert here all sub routers
  test: testRouter,
});

export type AppRouterType = typeof appRouter;
