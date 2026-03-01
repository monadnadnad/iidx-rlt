import { useMemo } from "react";

import type { Song } from "../../../schema/song";
import type { AtariRule, PlaySide, Ticket } from "../../../types";
import { createAtariMap } from "../../../utils/atari";
import { filterTickets, matchTicket } from "../../../utils/match";
import type { FilterMode, TicketSearchQuery } from "../model/search";

interface UseTicketFilterParams {
  tickets: Ticket[];
  searchQuery: TicketSearchQuery;
  filterMode: FilterMode;
  textageSong: Song | null;
  playSide: PlaySide;
  atariRules: AtariRule[];
}

export const useTicketFilter = ({
  tickets,
  searchQuery,
  filterMode,
  textageSong,
  playSide,
  atariRules,
}: UseTicketFilterParams) => {
  const atariMap = useMemo(() => createAtariMap(atariRules), [atariRules]);

  const selectedAtariRules = useMemo<AtariRule[]>(() => {
    if (!textageSong) return [];
    return atariMap.getRulesForSong(textageSong.songId, textageSong.difficulty) ?? [];
  }, [atariMap, textageSong]);

  const filteredTickets = useMemo(() => {
    const searched = filterTickets(tickets, searchQuery, playSide);

    const applyAtariFilter = filterMode === "recommend" && textageSong;
    if (!applyAtariFilter) return searched;

    return searched.filter((ticket) =>
      selectedAtariRules.some((rule) => rule.patterns.some((pattern) => matchTicket(ticket, pattern, playSide)))
    );
  }, [tickets, playSide, searchQuery, filterMode, textageSong, selectedAtariRules]);

  return { filteredTickets, selectedAtariRules, atariMap };
};
