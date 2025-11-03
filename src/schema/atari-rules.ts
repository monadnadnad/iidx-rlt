import { z } from "zod";

import { searchFormSchema } from "./search";
import { difficultySchema } from "./song";

export const atariRuleSchema = z.object({
  id: z.string(),
  songId: z.string(),
  difficulty: difficultySchema,
  title: z.string(),
  url: z.url(),
  priority: z.number(),
  description: z.string().optional(),
  patterns: z.array(searchFormSchema),
});

export type AtariRule = z.infer<typeof atariRuleSchema>;
