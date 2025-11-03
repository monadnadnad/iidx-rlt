import { describe, expect, it } from "vitest";

import type { Song } from "../../src/schema/song";
import { Difficulty } from "../../src/schema/song";

import { TARGET_DIFFICULTIES, TARGET_LEVELS, createChartInfoToSongsSchema, type ChartInfo } from "./schema";

type ChartInfoParser = ReturnType<typeof createChartInfoToSongsSchema>;

const createParser = (overrides?: {
  titlesById?: Map<string, string>;
  textageTagsById?: Map<string, string>;
  targetDifficulties?: readonly Difficulty[];
  targetLevels?: readonly number[];
}): ChartInfoParser =>
  createChartInfoToSongsSchema({
    titlesById:
      overrides?.titlesById ??
      new Map([
        ["1234", "Example Song"],
        ["2468", "Array BPM Song"],
        ["4680", "Object BPM Song"],
        ["5791", "Zero Notes Song"],
        ["5678", "Missing Title"],
        ["9999", "Filtered Song"],
      ]),
    textageTagsById:
      overrides?.textageTagsById ??
      new Map([
        ["1234", "example-tag"],
        ["2468", "arraybpm"],
        ["4680", "objectbpm"],
        ["5791", "zeronotes"],
        ["5678", "missing"],
        ["9999", "filtered"],
      ]),
    targetDifficulties: overrides?.targetDifficulties ?? TARGET_DIFFICULTIES,
    targetLevels: overrides?.targetLevels ?? TARGET_LEVELS,
  });

describe("createChartInfoToSongsSchema", () => {
  it("対象難易度の譜面を生成する", () => {
    const parser = createParser();

    const chartInfo: ChartInfo = {
      id: "1234",
      bpm: [95, 190] as const,
      in_ac: false,
      in_inf: false,
      level: {
        sp: [0, 10, 11, 12, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
      notes: {
        sp: [0, 0, 750, 800, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
    };
    const result: Song[] = parser.parse(chartInfo);

    expect(result).toHaveLength(2);
    expect(result[0]).toStrictEqual({
      id: "chart-1234-sph",
      songId: "1234",
      title: "Example Song",
      textageTag: "example-tag",
      difficulty: "sph",
      level: 11,
      notes: 750,
      bpm: { min: 95, max: 190 },
    });
    expect(result[1]).toStrictEqual({
      id: "chart-1234-spa",
      songId: "1234",
      title: "Example Song",
      textageTag: "example-tag",
      difficulty: "spa",
      level: 12,
      notes: 800,
      bpm: { min: 95, max: 190 },
    });
  });

  it("タイトル情報が欠けていればエラーにする", () => {
    const parser = createParser({
      titlesById: new Map(),
    });

    const chartInfo: ChartInfo = {
      id: "5678",
      bpm: 150,
      in_ac: false,
      in_inf: false,
      level: {
        sp: [0, 0, 0, 12, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
      notes: {
        sp: [0, 0, 0, 900, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
    };

    expect(() => parser.parse(chartInfo)).toThrow('title.json is missing entry for chart id "5678"');
  });

  it("対象レベル以外を除外する", () => {
    const parser = createParser({
      titlesById: new Map([["9999", "Filtered Song"]]),
      textageTagsById: new Map([["9999", "filtered"]]),
      targetLevels: [12],
      targetDifficulties: ["sph", "spa"],
    });

    const chartInfo: ChartInfo = {
      id: "9999",
      bpm: 160,
      in_ac: false,
      in_inf: false,
      level: {
        sp: [0, 0, 11, 12, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
      notes: {
        sp: [0, 0, 700, 800, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
    };

    const result: Song[] = parser.parse(chartInfo);

    expect(result).toHaveLength(1);
    const song = result.at(0);
    expect(song?.difficulty).toBe("spa");
  });

  it("BPMオブジェクトで難易度ごとの値を使う", () => {
    const parser = createParser();

    const chartInfo: ChartInfo = {
      id: "2468",
      bpm: {
        sp: [0, 150, 180, 200, 0],
        dp: [0, 0, 0, 0, 0],
      },
      in_ac: false,
      in_inf: false,
      level: {
        sp: [0, 9, 10, 12, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
      notes: {
        sp: [0, 0, 700, 900, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
    };

    const result: Song[] = parser.parse(chartInfo);

    expect(result).toHaveLength(2);
    expect(result[0].difficulty).toBe("sph");
    expect(result[0].bpm).toStrictEqual({ min: 180, max: 180 });
    expect(result[1].difficulty).toBe("spa");
    expect(result[1].bpm).toStrictEqual({ min: 200, max: 200 });
  });

  it("BPMオブジェクトからレンジ値を拾う", () => {
    const parser = createParser();

    const chartInfo: ChartInfo = {
      id: "4680",
      bpm: {
        sp: [0, 110, [140, 160], [200, 220], 0],
        dp: [100, 110, 140, 160, 180],
      },
      in_ac: false,
      in_inf: false,
      level: {
        sp: [0, 0, 10, 12, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
      notes: {
        sp: [0, 0, 700, 900, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
    };

    const result: Song[] = parser.parse(chartInfo);

    expect(result).toHaveLength(2);
    expect(result[0].bpm).toStrictEqual({ min: 140, max: 160 });
    expect(result[1].bpm).toStrictEqual({ min: 200, max: 220 });
  });

  it("ノーツやレベルが0なら出力しない", () => {
    const parser = createParser();

    const chartInfo: ChartInfo = {
      id: "5791",
      bpm: 150,
      in_ac: false,
      in_inf: false,
      level: {
        sp: [0, 0, 11, 0, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
      notes: {
        sp: [0, 0, 0, 900, 0] as const,
        dp: [0, 0, 0, 0, 0] as const,
      },
    };

    const result: Song[] = parser.parse(chartInfo);

    expect(result).toHaveLength(0);
  });
});
