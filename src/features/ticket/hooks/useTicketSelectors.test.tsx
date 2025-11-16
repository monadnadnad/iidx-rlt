import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTicketSelectors } from "./useTicketSelectors";
import { AtariRule, PlaySide, Ticket, TicketQuery } from "../../../types";
import type { Song } from "../../../schema/song";

const mockAtariRule: AtariRule = {
  id: "test",
  songId: "song-1",
  difficulty: "spa",
  title: "Test",
  url: "",
  priority: 5,
  patterns: [
    {
      scratchSideText: "123",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  ],
};

const mockSong: Song = {
  id: "song-1-spa",
  songId: "song-1",
  title: "Test",
  titleNormalized: "Test",
  version: 10,
  url: "",
  difficulty: "spa",
  level: 12,
};

const matchingTicket: Ticket = { laneText: "3214567" };
const nonMatchingTicket: Ticket = { laneText: "4561237" };

const mockTickets = [matchingTicket, nonMatchingTicket];
const mockAtariRules = [mockAtariRule];
const playSide: PlaySide = "1P";

describe("useTicketSelectors", () => {
  it("recommendモードで曲が選択された時、当たり定義にマッチするチケットのみに絞り込まれること", () => {
    const mockQuery: TicketQuery = {
      filterMode: "recommend",
      textageSong: mockSong,
      currentPage: 1,
      itemsPerPage: 50,
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    };

    const { result } = renderHook(() => useTicketSelectors(mockTickets, mockAtariRules, mockQuery, playSide));

    expect(result.current.paginatedTickets).toHaveLength(1);
    expect(result.current.paginatedTickets[0].laneText).toBe(matchingTicket.laneText);
  });

  it("allモードでは、当たり定義による絞り込みが行われないこと", () => {
    const mockQuery: TicketQuery = {
      filterMode: "all",
      textageSong: mockSong,
      currentPage: 1,
      itemsPerPage: 50,
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    };

    const { result } = renderHook(() => useTicketSelectors(mockTickets, mockAtariRules, mockQuery, playSide));

    expect(result.current.paginatedTickets).toHaveLength(2);
  });
});
