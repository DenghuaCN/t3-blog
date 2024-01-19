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


    })
})