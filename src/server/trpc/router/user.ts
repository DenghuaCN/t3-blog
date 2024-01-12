import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  /**
   * @desc 获取用户信息
   */
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
          username: true,
          _count: {
            select: {
              posts: true
            }
          }
        }
      })
    }
    ),

  /**
   * @desc 获取用户所有post
   */
  getUserPosts: publicProcedure
    .input(
      z.object({
        username: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { username } = input;

      const posts = await prisma.user.findUnique({
        where: {
          username
        },
        select: {
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              text: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true
                }
              },
              bookmarks: session?.user?.id ? {
                where: {
                  userId: session?.user?.id
                }
              } : false,
            }
          }
        }
      })

      return posts;
    }
    )


})