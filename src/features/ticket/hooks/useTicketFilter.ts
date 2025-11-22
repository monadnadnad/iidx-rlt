import { useMemo } from "react";

import type { AtariRule, PlaySide, Ticket } from "../../../types";
import { createAtariMap } from "../../../utils/atari";
import { filterTickets, matchTicket } from "../../../utils/match";
import type { TicketFilterState } from "../types";

interface UseTicketFilterParams {
  tickets: Ticket[];
  pattern: TicketFilterState;
  playSide: PlaySide;
  atariRules: AtariRule[];
}

export const useTicketFilter = ({ tickets, pattern, playSide, atariRules }: UseTicketFilterParams) => {
  const { filterMode, textageSong, ...searchPattern } = pattern;

  const atariMap = useMemo(() => createAtariMap(atariRules), [atariRules]);

  const selectedAtariRules = useMemo(() => {
    if (!textageSong) return [] as AtariRule[];
    return atariMap.getRulesForSong(textageSong.songId, textageSong.difficulty) ?? [];
  }, [atariMap, textageSong]);

  const filteredTickets = useMemo(() => {
    const searched = filterTickets(tickets, searchPattern, playSide);

    const applyAtariFilter = filterMode === "recommend" && textageSong;
    if (!applyAtariFilter) return searched;

    return searched.filter((ticket) =>
      selectedAtariRules.some((rule) => rule.patterns.some((pattern) => matchTicket(ticket, pattern, playSide)))
    );
  }, [tickets, playSide, searchPattern, filterMode, textageSong, selectedAtariRules]);

  return { filteredTickets, selectedAtariRules, atariMap };
};
