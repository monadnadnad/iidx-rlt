import { z } from "zod";

import { difficultySchema } from "./song";

export const memoSchema = z.object({
  songId: z.string(),
  difficulty: difficultySchema,
  laneText: z.string(),
  updatedAt: z.string(),
});

export type Memo = z.infer<typeof memoSchema>;
