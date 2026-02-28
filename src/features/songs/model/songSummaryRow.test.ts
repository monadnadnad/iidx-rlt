import { describe, expect, it } from "vitest";

import type { Song } from "../../../schema/song";
import { groupSongsByTitleId } from "./songSummaryRow";

const createSong = (overrides: Partial<Song>): Song => ({
  id: "default-id",
  songId: "default-song",
  title: "default-title",
  titleNormalized: "default-title",
  version: 1,
  versionName: "1st style",
  url: "https://example.com",
  difficulty: "spa",
  level: 12,
  ...overrides,
});

describe("groupSongsByTitleId", () => {
  it("同一songIdのSPH/SPA/SPLを1行に集約する", () => {
    const songs: Song[] = [
      createSong({ id: "a-sph", songId: "a", title: "A", titleNormalized: "a", difficulty: "sph", level: 11 }),
      createSong({ id: "a-spa", songId: "a", title: "A", titleNormalized: "a", difficulty: "spa", level: 12 }),
      createSong({ id: "a-spl", songId: "a", title: "A", titleNormalized: "a", difficulty: "spl", level: 12 }),
      createSong({ id: "b-sph", songId: "b", title: "B", titleNormalized: "b", difficulty: "sph", level: 10 }),
    ];

    const rows = groupSongsByTitleId(songs);

    expect(rows).toHaveLength(2);
    expect(rows[0].songId).toBe("a");
    expect(rows[0].chartsByDifficulty.sph?.id).toBe("a-sph");
    expect(rows[0].chartsByDifficulty.spa?.id).toBe("a-spa");
    expect(rows[0].chartsByDifficulty.spl?.id).toBe("a-spl");
    expect(rows[1].songId).toBe("b");
    expect(rows[1].chartsByDifficulty.sph?.id).toBe("b-sph");
  });

  it("表示対象外難易度を除外し、titleNormalizedでソートする", () => {
    const songs: Song[] = [
      createSong({ id: "z-spa", songId: "z", title: "Z", titleNormalized: "z", difficulty: "spa", level: 12 }),
      createSong({ id: "a-spn", songId: "a", title: "A", titleNormalized: "a", difficulty: "spn", level: 8 }),
      createSong({ id: "m-sph", songId: "m", title: "M", titleNormalized: "m", difficulty: "sph", level: 10 }),
    ];

    const rows = groupSongsByTitleId(songs);

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.songId)).toStrictEqual(["m", "z"]);
  });
});
