import { z } from "zod";

export const unsplashSchema = z.object({
  searchQuery: z.string().min(1)
})