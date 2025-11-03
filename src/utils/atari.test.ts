import { describe, expect, it } from "vitest";

import type { AtariRule, SearchPattern, Ticket } from "../types";
import { createAtariMap } from "./atari";

const p1: SearchPattern = {
  scratchSideText: "123",
  isScratchSideUnordered: true,
  nonScratchSideText: "4567",
  isNonScratchSideUnordered: true,
};
const p2: SearchPattern = {
  scratchSideText: "246",
  isScratchSideUnordered: false,
  nonScratchSideText: "1357",
  isNonScratchSideUnordered: false,
};

const createRule = (id: string, priority: number, title: string, pattern: SearchPattern): AtariRule => ({
  id,
  songId: `song-${id}`,
  difficulty: "spa",
  title,
  url: "",
  priority: priority,
  patterns: [pattern],
});

describe(createAtariMap, () => {
  describe("getRulesForSong", () => {
    it("マッチするものだけ返す", () => {
      const map = createAtariMap([createRule("a", 1, "A", p1), createRule("b", 1, "B", p2)]);
      const rules = map.getRulesForSong("song-a", "spa");
      expect(rules).toBeDefined();
      expect(rules?.map((v) => v.id)).toEqual(["a"]);
    });
  });

  describe("getRulesForTicket", () => {
    it("マッチするものだけ返す(1P)", () => {
      const ticket: Ticket = { laneText: "1234567" };
      const map = createAtariMap([createRule("a", 1, "A", p1), createRule("b", 1, "B", p2)]);
      expect(map.getRulesForTicket(ticket, "1P")?.map((v) => v.id)).toEqual(["a"]);
    });
    it("マッチするものだけ返す(2P)", () => {
      const ticket: Ticket = { laneText: "7654321" };
      const map = createAtariMap([createRule("a", 1, "A", p1), createRule("b", 1, "B", p2)]);
      expect(map.getRulesForTicket(ticket, "2P")?.map((v) => v.id)).toEqual(["a"]);
    });
    it("優先度でソートされる", () => {
      const ticket: Ticket = { laneText: "1234567" };
      const map = createAtariMap([
        createRule("a", 1, "A", p1),
        createRule("b", 2, "B", p1),
        createRule("c", 3, "C", p1),
      ]);
      expect(map.getRulesForTicket(ticket, "1P")?.map((v) => v.id)).toEqual(["c", "b", "a"]);
    });
    it("マッチしない場合はundefinedを返す", () => {
      const ticket: Ticket = { laneText: "1357246" };
      const map = createAtariMap([createRule("a", 1, "A", p1)]);
      expect(map.getRulesForTicket(ticket, "1P")).toBeUndefined();
    });
  });

  describe("getHighlightColor", () => {
    const createRule = (priority: number): AtariRule => ({
      id: `rule-${priority}`,
      songId: `song-${priority}`,
      difficulty: "spa",
      title: `Song ${priority}`,
      url: "",
      priority: priority,
      patterns: [
        {
          scratchSideText: "123",
          isScratchSideUnordered: true,
          nonScratchSideText: "4567",
          isNonScratchSideUnordered: true,
        },
      ],
    });

    const testCases = [
      {
        description: "優先度が5以上の場合はゴールドを返す",
        rules: [createRule(5)],
        expectedColor: "gold",
      },
      {
        description: "マッチ数が5以上の場合はゴールドを返す",
        rules: [createRule(1), createRule(1), createRule(1), createRule(1), createRule(1)],
        expectedColor: "gold",
      },
      {
        description: "優先度が2以上でゴールド条件を満たさない場合はシルバーを返す",
        rules: [createRule(2)],
        expectedColor: "silver",
      },
      {
        description: "マッチ数が3以上でゴールド条件を満たさない場合はシルバーを返す",
        rules: [createRule(1), createRule(1), createRule(1)],
        expectedColor: "silver",
      },
      {
        description: "マッチ数が1以上でシルバー・ゴールド条件を満たさない場合はブロンズを返す",
        rules: [createRule(1)],
        expectedColor: "bronze",
      },
      {
        description: "ルールが提供されない場合はnullを返す",
        rules: [],
        expectedColor: undefined,
      },
      {
        description: "品質（優先度）が数量（マッチ数）より優先される",
        rules: [createRule(5), createRule(1), createRule(1)],
        expectedColor: "gold",
      },
    ];

    it.each(testCases)("$description", ({ rules, expectedColor }) => {
      const atariMap = createAtariMap(rules);
      const color = atariMap.getColorForTicket({ laneText: "1234567" }, "1P");
      expect(color).toBe(expectedColor);
    });
  });
});
