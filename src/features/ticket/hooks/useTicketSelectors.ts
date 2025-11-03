import { useMemo } from "react";
import { AtariRule, PlaySide, SongInfo, Ticket, TicketQuery } from "../../../types";
import { createAtariMap } from "../../../utils/atari";
import { filterTickets, matchTicket } from "../../../utils/match";

export const useTicketSelectors = (
  tickets: Ticket[],
  songs: SongInfo[],
  atariRules: AtariRule[],
  query: TicketQuery,
  playSide: PlaySide
) => {
  const atariMap = useMemo(() => createAtariMap(atariRules), [atariRules]);

  const {
    scratchSideText,
    isScratchSideUnordered,
    nonScratchSideText,
    isNonScratchSideUnordered,
    filterMode,
    textageSong,
    itemsPerPage,
    currentPage,
  } = query;

  const selectedAtariRules = useMemo(() => {
    if (!textageSong) {
      return [];
    }
    return atariMap.getRulesForSong(textageSong.songId, textageSong.difficulty) ?? [];
  }, [atariMap, textageSong]);

  const filteredTickets = useMemo(() => {
    const searched = filterTickets(
      tickets,
      { scratchSideText, isScratchSideUnordered, nonScratchSideText, isNonScratchSideUnordered },
      playSide
    );

    const applyAtariFilter = filterMode === "recommend" && textageSong;
    if (!applyAtariFilter) return searched;

    return searched.filter((ticket) =>
      selectedAtariRules.some((rule) => rule.patterns.some((pattern) => matchTicket(ticket, pattern, playSide)))
    );
  }, [
    tickets,
    playSide,
    selectedAtariRules,
    scratchSideText,
    isScratchSideUnordered,
    nonScratchSideText,
    isNonScratchSideUnordered,
    filterMode,
    textageSong,
  ]);

  const totalCount = filteredTickets.length;
  const pageCount = useMemo(() => Math.ceil(totalCount / itemsPerPage), [totalCount, itemsPerPage]);

  const pageSlice = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  const paginatedTickets = useMemo(
    () =>
      pageSlice.map((ticket) => ({
        ...ticket,
        highlightColor: atariMap.getColorForTicket(ticket, playSide),
      })),
    [pageSlice, atariMap, playSide]
  );

  const atariSongs = useMemo(
    () => songs.filter((song) => (atariMap.getRulesForSong(song.songId, song.difficulty) ?? []).length > 0),
    [songs, atariMap]
  );

  return {
    atariMap,
    atariSongs,
    selectedAtariRules,
    paginatedTickets,
    pageCount,
    totalCount,
  };
};
