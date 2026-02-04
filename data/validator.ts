import { z } from "zod";

export const viewSchema = z.object({
  articleId: z.string(),
});