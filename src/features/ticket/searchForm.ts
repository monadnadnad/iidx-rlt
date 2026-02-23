import { z } from "zod";

import { createLaneTextSchema } from "../../utils/laneText";

export const searchFormSchema = z.object({
  scratchSideText: createLaneTextSchema(3, { allowWildcard: true, requireFullLength: false }),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, { allowWildcard: true, requireFullLength: false }),
  isNonScratchSideUnordered: z.boolean(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
