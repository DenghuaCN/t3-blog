import { createApi } from 'unsplash-js';

import { protectedProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

import { unsplashSchema } from "../../../schema/unsplash";

const unsplash = createApi({
  accessKey: env.UNSPLASH_API_ACCESS_KEY,
});

export const unsplashRouter = router({
  /**
   * @desc Request picture from unsplash through query
   */
  getImages: protectedProcedure
    .input(unsplashSchema)
    .query(async ({ input }) => {
      const { searchQuery } = input;

      try {
        // https://unsplash.com/documentation#search-photos
        const images = await unsplash.search.getPhotos({
          query: searchQuery,
          orientation: 'landscape',
        })
        return images.response;

      } catch (error) {
        console.error(error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'unsplash api not working'
        })
      }

    })
})