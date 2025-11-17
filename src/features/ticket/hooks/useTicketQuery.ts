import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Song } from "../../../schema/song";
import { SearchPattern } from "../../../types";
import { createLaneTextSchema } from "../../../utils/laneText";

export type FilterMode = "recommend" | "all";

export type TicketQuery = SearchPattern & {
  filterMode: FilterMode;
  textageSong: Song | null;
  itemsPerPage: number;
  currentPage: number;
};

export const searchFormSchema = z.object({
  scratchSideText: createLaneTextSchema(3, { allowWildcard: true, requireFullLength: false }),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, { allowWildcard: true, requireFullLength: false }),
  isNonScratchSideUnordered: z.boolean(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const useTicketQuery = () => {
  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: {
      scratchSideText: "",
      isScratchSideUnordered: true,
      nonScratchSideText: "",
      isNonScratchSideUnordered: true,
    },
  });

  const [filterMode, setFilterMode] = useState<FilterMode>("recommend");
  const [textageSong, setTextageSong] = useState<Song | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterModeChange = useCallback((newMode: FilterMode) => {
    setFilterMode(newMode);
    setTextageSong(null);
    setCurrentPage(1);
  }, []);

  const handleTextageSongChange = useCallback((song: Song | null) => {
    setTextageSong(song);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number | null) => {
    if (newItemsPerPage !== null) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const formValues = methods.watch();
  const query: TicketQuery = {
    ...formValues,
    scratchSideText: formValues.scratchSideText.padEnd(3, "*"),
    nonScratchSideText: formValues.nonScratchSideText.padEnd(4, "*"),
    filterMode,
    textageSong,
    itemsPerPage,
    currentPage,
  };

  return {
    query,
    methods,
    handleFilterModeChange,
    handleTextageSongChange,
    handleItemsPerPageChange,
    handlePageChange,
  };
};
