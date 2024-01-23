// post.ts用于处理Post相关操作的路由
import { z } from 'zod';
import slugify from 'slugify';

import { TRPCError } from '@trpc/server';

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { writeFormSchema } from "../../../components/WriteFormModal";


export const postRouter = router({
  /**
   * @desc 创建Post
   */
  createPost: protectedProcedure
    .input(
      writeFormSchema.and(
        // tagIds : [{ id: string }]
        z.object({
          tagsIds: z.array(
            z.object({
              id: z.string()
            })
          )
            .optional()
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { title, description, text, tagsIds, html } = input;

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
          html,
          slug: slugify(title),
          // authorId: session.user.id // 不能将session.user.id直接赋值给authorId，Post与User表是一对多关系，通过connect连接
          author: {
            connect: {
              // https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect
              id: session.user.id
            }
          },
          tags: {
            // connect multiple record: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records
            connect: tagsIds
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
      const { prisma, session } = ctx;
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc"
        },
        /**
         * https://www.prisma.io/docs/orm/prisma-client/queries/select-fields
         * https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-reads
         * https://stackoverflow.com/questions/69679956/nestjs-prisma-orm-using-select-versus-include-when-fetching-data-records
         *
         * select可以返回特定字段 (允许您返回有限的字段子集而不是所有字段：)
         * include包含关系查询 (允许您返回部分或全部关系字段)
         * 例: 返回post表中所有标量字段，并且返回'author'表中的'name'和'image'字段
         * 如果将author: true，则表示post表所有标量字段 AND author表中所有非关系字段
         * include: {
         *   author: {
         *     select: {
         *       name: true,
         *       image: true,
         *     }
         *   },
         * },
         */
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          text: true,
          createdAt: true,
          featuredImage: true,
          author: {
            select: {
              name: true,
              image: true,
              username: true
            }
          },
          tags: {
            select: {
              name: true,
              id: true,
              slug: true,
            }
          },
          /**
           * 返回当前用户ID的bookmarks字段，查询只针对当前登陆用户，缩小查询范围。如果当前用户不存在，则不查询bookmarks字段
           * 如果bookmarks:true，则表示返回所有为此post增加了bookmark的用户
           */
          bookmarks: session?.user?.id ? {
            where: {
              userId: session?.user?.id
            }
          } : false,
        }
      });

      return posts;
    }
    ),

  /**
   * @desc 获取单个post
   */
  getPost: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id } = input;

      const post = await prisma.post.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          description: true,
          title: true,
          text: true,
          html: true,
          authorId: true,
          featuredImage: true,
          likes: session?.user?.id ? {
            /**
             * 用户已登陆时才会获取likes字段信息，减少查询
             */
            where: {
              userId: session?.user?.id
            }
          } : false
        }
      })
      return post;
    }
    ),


  /**
   * @desc like post
   */
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId
        }
      })
    }
    ),

  /**
   * @desc unlike
   */
  disLikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id
          }
        }
      })
    }
    ),

  /**
   * @desc 对帖子加入书签
   */
  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          postId,
          userId: session.user.id
        }
      })
    }
    ),

  /**
   * @desc 对帖子取消书签
   */
  removeBookmark: protectedProcedure
    .input(
      z.object({
        postId: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id
          }
        }
      })
    }
    ),


  /**
   * @desc 添加评论
   */
  submitComment: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
        postId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text, postId } = input;

      await prisma.comment.create({
        data: {
          text,
          user: {
            connect: {
              id: session.user.id
            }
          },
          post: {
            connect: {
              id: postId
            }
          }
        }
      })
    }
    ),


  /**
   * @desc 获取所有评论
   */
  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string()
      })
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const { postId } = input;

      const comments = await prisma.comment.findMany({
        where: {
          postId
        },
        select: {
          id: true,
          text: true,
          user: {
            select: {
              name: true,
              image: true
            }
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return comments;
    }
    ),

  /**
   * @desc 获取阅读列表
   */
  getReadingList: protectedProcedure
    .query(async ({ ctx: { prisma, session } }) => {
      const allBookmarks = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id
        },
        take: 4,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true, // 返回bookmark表的id字段
          post: {
            select: { // 选择post表中的title,description,createdAt字段
              id: true,
              title: true,
              description: true,
              createdAt: true,
              featuredImage: true,
              author: { // 选择user表(author关系)中的name和image字段
                select: {
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      })

      return allBookmarks;
    }),

  /**
   * @desc 更新post标题背景图
   */
  updatePostFeaturedImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        postId: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const { imageUrl, postId } = input;

      // 判断当前登录用户是否是post的所有者
      const postData = await prisma.post.findUnique({
        where: {
          id: postId
        }
      })
      if (postData?.authorId !== session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'you are not owner of this post.'
        })
      }

      await prisma.post.update({
        where: {
          id: postId
        },
        data: {
          featuredImage: imageUrl
        }
      })

    })

})