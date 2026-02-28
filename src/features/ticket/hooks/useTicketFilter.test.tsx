import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Song } from "../../../schema/song";
import { AtariRule, PlaySide, Ticket } from "../../../types";
import { useTicketFilter } from "./useTicketFilter";

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
  versionName: "10th style",
  url: "",
  difficulty: "spa",
  level: 12,
};

const matchingTicket: Ticket = { laneText: "3214567" };
const nonMatchingTicket: Ticket = { laneText: "4561237" };

const mockTickets = [matchingTicket, nonMatchingTicket];
const mockAtariRules = [mockAtariRule];
const playSide: PlaySide = "1P";

const basePattern = {
  scratchSideText: "***",
  isScratchSideUnordered: true,
  nonScratchSideText: "****",
  isNonScratchSideUnordered: true,
};

describe("useTicketFilter", () => {
  it("recommendモードで曲が選択された時、当たり定義にマッチするチケットのみに絞り込まれる", () => {
    const { result } = renderHook(() =>
      useTicketFilter({
        tickets: mockTickets,
        atariRules: mockAtariRules,
        playSide,
        searchQuery: basePattern,
        filterMode: "recommend",
        textageSong: mockSong,
      })
    );

    expect(result.current.filteredTickets).toHaveLength(1);
    expect(result.current.filteredTickets[0].laneText).toBe(matchingTicket.laneText);
  });

  it("allモードでは当たり定義による絞り込みを行わない", () => {
    const { result } = renderHook(() =>
      useTicketFilter({
        tickets: mockTickets,
        atariRules: mockAtariRules,
        playSide,
        searchQuery: basePattern,
        filterMode: "all",
        textageSong: mockSong,
      })
    );

    expect(result.current.filteredTickets).toHaveLength(2);
  });

  it("配置パターンでチケットが絞り込まれる", () => {
    const { result } = renderHook(() =>
      useTicketFilter({
        tickets: mockTickets,
        atariRules: mockAtariRules,
        playSide,
        searchQuery: {
          scratchSideText: "321",
          isScratchSideUnordered: true,
          nonScratchSideText: "4567",
          isNonScratchSideUnordered: false,
        },
        filterMode: "recommend",
        textageSong: null,
      })
    );

    expect(result.current.filteredTickets).toHaveLength(1);
    expect(result.current.filteredTickets[0].laneText).toBe(matchingTicket.laneText);
  });
});
