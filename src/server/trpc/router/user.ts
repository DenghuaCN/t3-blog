import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { username } = input;

      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          name: true,
          image: true,
          id: true,
          username: true
        }
      })
    }),
})