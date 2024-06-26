import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import slugify from "slugify";
import { TRPCError } from "@trpc/server";

import { tagFormSchema } from "../../../components/TagModal";


export const tagRouter = router({
  /**
   * @desc 获取标签
   */
  getTags: protectedProcedure
    .query(async ({ ctx: { prisma } }) => {
      return await prisma.tag.findMany();
    }),

  /**
   * @desc 创建标签
   */
  createTag: protectedProcedure
    .input(tagFormSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {

      const tag = await prisma.tag.findUnique({
        where: {
          name: input.name,
        }
      })
      // 无法创建重复标签
      if (tag) {
        throw new TRPCError({
          code: "CONFLICT",
          message: 'tag already exists!'
        })
      }



      await prisma?.tag.create({
        data: {
          ...input,
          slug: slugify(input.name)
        }
      })
    }),
})