import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * @desc 登陆校验 中间件
 * Reusable middleware to ensure users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 * @desc 会走isAuthed中间件，此procedure收到保护
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Unprotected procedure
 * @desc 此procedure不受保护
 */
export const publicProcedure = t.procedure;