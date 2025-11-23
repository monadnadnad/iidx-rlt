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
  normalizedTitlesById?: Map<string, string>;
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
    songInfoById: new Map([
      ["1234", { artist: "Example Artist", genre: "Example Genre", version: 29 }],
      ["2468", { artist: "Array BPM Artist", genre: "Array BPM Genre", version: 28 }],
      ["4680", { artist: "Object BPM Artist", genre: "Object BPM Genre", version: 27 }],
      ["5791", { artist: "Zero Notes Artist", genre: "Zero Notes Genre", version: 26 }],
      ["5678", { artist: "Missing Title Artist", genre: "Missing Title Genre", version: 25 }],
      ["9999", { artist: "Filtered Artist", genre: "Filtered Genre", version: 24 }],
    ]),
    normalizedTitlesById:
      overrides?.normalizedTitlesById ??
      new Map([
        ["1234", "ExampleSong"],
        ["2468", "ArrayBPMSong"],
        ["4680", "ObjectBPMSong"],
        ["5791", "ZeroNotesSong"],
        ["5678", "MissingTitle"],
        ["9999", "FilteredSong"],
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
      id: "1234-sph",
      songId: "1234",
      title: "Example Song",
      titleNormalized: "ExampleSong",
      version: 29,
      url: "https://textage.cc/score/29/example-tag.html?1HB00",
      difficulty: "sph",
      level: 11,
    });
    expect(result[1]).toStrictEqual({
      id: "1234-spa",
      songId: "1234",
      title: "Example Song",
      titleNormalized: "ExampleSong",
      version: 29,
      url: "https://textage.cc/score/29/example-tag.html?1AC00",
      difficulty: "spa",
      level: 12,
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

    const result = parser.parse(chartInfo);

    expect(result).toHaveLength(1);

    const song = result[0];

    expect(song.difficulty).toBe("spa");
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
    expect(result[1].difficulty).toBe("spa");
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
