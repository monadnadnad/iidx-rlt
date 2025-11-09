import { z } from "zod";

import { difficultySchema } from "./song";
import { createLaneTextSchema } from "../utils/laneText";

const searchPatternSchema = z.object({
  scratchSideText: createLaneTextSchema(3, { allowWildcard: true, requireFullLength: false }),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, { allowWildcard: true, requireFullLength: false }),
  isNonScratchSideUnordered: z.boolean(),
});

export const atariRuleSchema = z.object({
  id: z.string(),
  songId: z.string(),
  difficulty: difficultySchema,
  title: z.string(),
  url: z.url(),
  priority: z.number(),
  description: z.string().optional(),
  patterns: z.array(searchPatternSchema),
});

export type AtariRule = z.infer<typeof atariRuleSchema>;
