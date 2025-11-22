import { z } from "zod";

import type { Song } from "../../schema/song";
import type { SearchPattern } from "../../types";
import { createLaneTextSchema } from "../../utils/laneText";

export type FilterMode = "recommend" | "all";

export const searchFormSchema = z.object({
  scratchSideText: createLaneTextSchema(3, { allowWildcard: true, requireFullLength: false }),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, { allowWildcard: true, requireFullLength: false }),
  isNonScratchSideUnordered: z.boolean(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export type TicketFilterState = SearchPattern & {
  filterMode: FilterMode;
  textageSong: Song | null;
};
