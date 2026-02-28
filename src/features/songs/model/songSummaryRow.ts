import type { Song } from "../../../schema/song";

export type DifficultyKey = "sph" | "spa" | "spl";

export const SONG_SUMMARY_DIFFICULTIES: DifficultyKey[] = ["sph", "spa", "spl"];

export type SongSummaryRow = {
  songId: string;
  title: string;
  titleNormalized: string;
  versionName: string;
  chartsByDifficulty: Partial<Record<DifficultyKey, Song>>;
};

const SUMMARY_DIFFICULTY_SET = new Set<Song["difficulty"]>(SONG_SUMMARY_DIFFICULTIES);
const isSummaryDifficulty = (difficulty: Song["difficulty"]): difficulty is DifficultyKey =>
  SUMMARY_DIFFICULTY_SET.has(difficulty);

const compareRows = (a: SongSummaryRow, b: SongSummaryRow) =>
  a.titleNormalized.localeCompare(b.titleNormalized, "ja") || a.songId.localeCompare(b.songId, "ja");

export const groupSongsByTitleId = (songs: Song[]): SongSummaryRow[] => {
  const map = new Map<string, SongSummaryRow>();

  for (const song of songs) {
    if (!isSummaryDifficulty(song.difficulty)) {
      continue;
    }
    const difficulty = song.difficulty;

    const current = map.get(song.songId);
    if (!current) {
      map.set(song.songId, {
        songId: song.songId,
        title: song.title,
        titleNormalized: song.titleNormalized ?? song.title,
        versionName: song.versionName,
        chartsByDifficulty: { [difficulty]: song },
      });
      continue;
    }

    current.chartsByDifficulty[difficulty] = song;
  }

  return Array.from(map.values()).sort(compareRows);
};
