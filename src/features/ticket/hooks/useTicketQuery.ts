import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { searchFormSchema, SearchFormValues } from "../../../schema";
import { FilterMode, SongInfo, TicketQuery, SearchPattern } from "../../../types";

const defaultSearchPattern: SearchPattern = {
  scratchSideText: "",
  isScratchSideUnordered: true,
  nonScratchSideText: "",
  isNonScratchSideUnordered: true,
};

export const useTicketQuery = () => {
  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: defaultSearchPattern,
  });

  const [filterMode, setFilterMode] = useState<FilterMode>("recommend");
  const [textageSong, setTextageSong] = useState<SongInfo | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterModeChange = useCallback((newMode: FilterMode) => {
    setFilterMode(newMode);
    setTextageSong(null);
    setCurrentPage(1);
  }, []);

  const handleTextageSongChange = useCallback((song: SongInfo | null) => {
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
