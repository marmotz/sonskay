import { initTRPC, TRPCError } from '@trpc/server';
import { getSessionFromHeaders } from '../lib/auth';

import { type NextRequest } from 'next/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { prisma } from '../lib/prisma';

//context : will be passed to all tRPC procedures
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  //try to get session from headers
  const session = await getSessionFromHeaders(opts.req.headers);

  return {
    prisma,
    session,
    userId: session?.id,
    headers: opts.req.headers,
  };
};

export type CreateContextType = Awaited<ReturnType<typeof createTRPCContext>>;

//tRPC initialization

const t = initTRPC.context<CreateContextType>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

//export tRPC helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

//Public Procedure
export const publicProcedure = t.procedure;

//Middleware for authentication

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      userId: ctx.userId,
      session: ctx.session,
    },
  });
});

//Protected Procedure
export const protectedProcedure = t.procedure.use(isAuthed);
