import { z } from "zod";
import { decode } from 'base64-arraybuffer'
import isDataURI from 'validator/lib/isDataURI'
import { createClient } from '@supabase/supabase-js'

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

// Create a single supabase client for interacting with your database
const supabase = createClient(env.SUPABASE_PUBLIC_URL, env.SUPABASE_PUBLIC_KEY)


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
              featuredImage: true,
              tags: {
                select: {
                  name: true,
                  id: true,
                  slug: true,
                }
              },
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
    ),

  /**
   * @desc 上传图片
   */
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageAsDataUrl: z.string().refine(val => isDataURI(val)),
        mimeType: z.string(),
        username: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { imageAsDataUrl, mimeType, username } = input;

      // const user = await prisma.user.findUnique({
      //   where: {
      //     username
      //   },
      //   select: {
      //     id: true,
      //     username: true,
      //     name: true
      //   }
      // })
      // if (user?.id !== session.user.id) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // }

      /**
       * `image` here is a base64 encoded data URI, it is NOT a base64 string, so we need extract
       * the real base64 string from it.
       * Check the syntax here: https://en.wikipedia.org/wiki/Data_URI_scheme#Syntax
       * remove the "data:image/jpeg;base64,"
       */

      const imageBase64Str = imageAsDataUrl.replace(/^.+,/, "");

      const { data, error } = await supabase
        .storage
        .from('common') // bucket name
        .upload(`avatars/${username}.png`, decode(imageBase64Str), {
          contentType: mimeType,
          upsert: true // 文件存在会直接覆盖
        })

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'upload failed to supabase'
        })
      }

      const { data: { publicUrl } } = await supabase.storage.from('common').getPublicUrl(data?.path);

      console.log(publicUrl);

      await prisma.user.update({
        where: {
          id: session.user.id as string
        },
        data: {
          image: publicUrl
        }
      })


    }),

  /**
   * @desc 获取用户感兴趣的post
   */
  getSuggestions: protectedProcedure
    .query(async ({ ctx: { prisma, session } }) => {

      /**
       * 我们需要一组用户。这些用户应该喜欢将当前用户相同的帖子添加为书签或点赞。
       * 首先获取当前用户的点赞和收藏
       */
      const query = {
        where: {
          // 注意查的点赞表和书签表里的userId，不是uuid
          userId: session.user.id,
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        take: 10
      }

      const likedPostTags = await prisma.like.findMany(query); // 根据当前登录用户id找到点赞集合，从这些点赞中找到对应的post，再找到对应post的tags
      const bookmarkedPostTags = await prisma.bookmark.findMany(query) // 根据当前登录用户id找到书签集合，从这些书签中找到对应的post，再找到对应post的tags

      const interestedTags: string[] = [];

      // 被点赞的post的tags
      likedPostTags.forEach((like) => {
        const tagNameArr: string[] = like.post.tags.map(tag => tag.name);
        interestedTags.push(...tagNameArr);
      })
      // 被书签的post的tags
      bookmarkedPostTags.forEach((bookmark) => {
        const tagNameArr: string[] = bookmark.post.tags.map(tag => tag.name);
        interestedTags.push(...tagNameArr);
      })

      /**
       * @desc 一些用户，这些用户点赞或者收藏了 -> 当前用户喜欢或者收藏的post
       */
      const suggestions = await prisma.user.findMany({
        where: {
          OR: [
            {
              likes: { // 这个user的所有点赞
                some: {
                  post: { // 点赞的post
                    tags: { // post的所有标签中
                      some: {
                        name: { // 某些标签在 -> 当前登录用户点赞的post的标签数组中
                          in: interestedTags
                        }
                      }
                    }
                  }
                }
              }
            },
            {
              bookmarks: { // 这个user的所有书签
                some: {
                  post: { // 书签对应的post
                    tags: { // post的所有标签中
                      some: {
                        name: { // 某些标签在 -> 当前登录用户收藏的post的标签数组中
                          in: interestedTags
                        }
                      }
                    }
                  }
                }
              }
            }
          ],
          NOT: {
            id: session.user.id // 检索范围不包括当前用户
          }
        },
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        },
        take: 4 // 需要的记录的数量
      })

      return suggestions;

    })
})