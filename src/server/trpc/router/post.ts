// post.ts用于处理Post相关操作的路由

import slugify from 'slugify';

import { prisma } from '../../db/client';
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { writeFormSchema } from "../../../components/WriteFormModal";
import { TRPCError } from '@trpc/server';


export const postRouter = router({
  // 创建Post
  createPost: protectedProcedure
    .input(writeFormSchema)
    .mutation(async ({ ctx, input }) => {

      const { prisma, session } = ctx;
      const { title, description, text } = input;

      // 根据title区分是否创建过相同的post
      const isExistSamePost = await prisma.post.findUnique({
        where: {
          title
        }
      });
      console.log('isExistSamePost', isExistSamePost);


      if (isExistSamePost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "post with this title already exists!"
        })
      }


      await prisma.post.create({
        data: {
          title,
          description,
          text,
          slug: slugify(title),
          // authorId: session.user.id // 不能将session.user.id直接赋值给authorId，Post与User表是一对多关系，通过connect连接
          author: {
            connect: {
              // https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect
              id: session.user.id
            }
          }
        }
      })
    }
    ),

  /**
   * @desc 获取所有Post
   * 此过程不需要protected，故使用publicProcedure
   */
  getPosts: publicProcedure
    .query(async ({ ctx }) => {

      const { prisma } = ctx;
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc"
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            }
          }
        }
      });

      return posts;
    }
    )
})