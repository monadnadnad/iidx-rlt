import { z } from "zod";

import { createLaneTextSchema } from "../../../utils/laneText";

export type FilterMode = "recommend" | "all";

export const searchFormSchema = z.object({
  scratchSideText: createLaneTextSchema(3, { allowWildcard: true, requireFullLength: false }),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, { allowWildcard: true, requireFullLength: false }),
  isNonScratchSideUnordered: z.boolean(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export interface TicketSearchQuery {
  scratchSideText: string;
  isScratchSideUnordered: boolean;
  nonScratchSideText: string;
  isNonScratchSideUnordered: boolean;
}

export const normalizeTicketSearchForm = (values?: Partial<SearchFormValues>): TicketSearchQuery => {
  const {
    scratchSideText = "",
    isScratchSideUnordered = true,
    nonScratchSideText = "",
    isNonScratchSideUnordered = true,
  } = values ?? {};

  return {
    scratchSideText: scratchSideText.padEnd(3, "*"),
    isScratchSideUnordered,
    nonScratchSideText: nonScratchSideText.padEnd(4, "*"),
    isNonScratchSideUnordered,
  };
};
