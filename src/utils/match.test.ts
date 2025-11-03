import { describe, it, expect } from "vitest";
import { filterTickets } from "./match";
import type { Ticket, SearchPattern } from "../types";

const sampleTickets: Ticket[] = [
  { laneText: "1234567" },
  { laneText: "3217654" },
  { laneText: "7654321" },
  { laneText: "1746352" }, // Xperanza当たり例1P
  { laneText: "3645271" }, // Xperanza当たり例2P
];

describe("filterTickets", () => {
  it("1Pの順序通り検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSideText: "123",
      isScratchSideUnordered: false,
      nonScratchSideText: "4567",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");

    expect(result.map((t) => t.laneText)).toStrictEqual(["1234567"]);
  });

  it("1Pの順不同検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSideText: "17*",
      isScratchSideUnordered: true,
      nonScratchSideText: "35**",
      isNonScratchSideUnordered: true,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");

    expect(result.map((t) => t.laneText)).toStrictEqual(["1746352"]);
  });

  it("2Pの順序通り検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSideText: "321",
      isScratchSideUnordered: false,
      nonScratchSideText: "7654",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "2P");

    expect(result.map((t) => t.laneText)).toStrictEqual(["7654321"]);
  });

  it("2Pの順不同検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSideText: "17*",
      isScratchSideUnordered: true,
      nonScratchSideText: "35**",
      isNonScratchSideUnordered: true,
    };
    const result = filterTickets(sampleTickets, pattern, "2P");

    expect(result.map((t) => t.laneText)).toStrictEqual(["3645271"]);
  });

  it("ワイルドカード（皿側）が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSideText: "1**",
      isScratchSideUnordered: false,
      nonScratchSideText: "4567",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");

    expect(result.map((t) => t.laneText)).toStrictEqual(["1234567"]);
  });

  it("ワイルドカード（非皿側）が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSideText: "123",
      isScratchSideUnordered: false,
      nonScratchSideText: "4***",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");

    expect(result.map((t) => t.laneText)).toStrictEqual(["1234567"]);
  });

  it("不正な長さの検索条件の場合結果が空になること", () => {
    const invalidPattern: SearchPattern = {
      scratchSideText: "12",
      isScratchSideUnordered: false,
      nonScratchSideText: "4567",
      isNonScratchSideUnordered: false,
    };

    expect(filterTickets(sampleTickets, invalidPattern, "1P")).toStrictEqual([]);
  });
});
