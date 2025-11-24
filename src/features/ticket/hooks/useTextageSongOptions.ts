import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Song } from "../../../schema/song";
import { appDb } from "../../../db/appDb";
import { buildDifficultyLevelPairs, normalizeSongText } from "../../../utils/songSearch";

type SearchMode = "recommend" | "all";

export type SongDifficulty = Extract<Song["difficulty"], "sph" | "spa" | "spl">;

export interface RecommendedChart {
  songId: string;
  difficulty: SongDifficulty;
}

interface UseTextageSongOptionsParams {
  recommendedCharts: ReadonlyArray<RecommendedChart>;
  searchMode: SearchMode;
  selectedDifficulties: Set<SongDifficulty>;
  selectedLevels: Set<number>;
  inputValue: string;
  formatSongLabel: (song: Song) => string;
}

const querySongs = async (
  searchMode: SearchMode,
  difficultyValues: SongDifficulty[],
  levelValues: number[],
  recommendedIds: string[],
  normalizedQuery: string
) => {
  if (difficultyValues.length === 0 || levelValues.length === 0) {
    return [] as Song[];
  }

  if (searchMode === "recommend") {
    if (recommendedIds.length === 0) {
      return [] as Song[];
    }
    return appDb.songs
      .where("id")
      .anyOf(recommendedIds)
      .filter((song) => difficultyValues.includes(song.difficulty as SongDifficulty))
      .toArray();
  }

  const pairs = buildDifficultyLevelPairs(difficultyValues, levelValues);
  if (pairs.length === 0) {
    return [] as Song[];
  }

  let collection = appDb.songs.where("[difficulty+level]").anyOf(pairs);
  if (normalizedQuery) {
    const query = normalizedQuery;
    collection = collection.filter((song) => normalizeSongText(song.titleNormalized ?? song.title).includes(query));
  }
  return collection.toArray();
};

export const useTextageSongOptions = ({
  recommendedCharts,
  searchMode,
  selectedDifficulties,
  selectedLevels,
  inputValue,
  formatSongLabel,
}: UseTextageSongOptionsParams) => {
  const isRecommendMode = searchMode === "recommend";
  const placeholder = isRecommendMode ? "当たり配置が定義済みの曲を検索" : "曲名で検索 (例: 冥)";

  const normalizedQuery = useMemo(() => normalizeSongText(inputValue), [inputValue]);
  const difficultyValues = useMemo(() => Array.from(selectedDifficulties), [selectedDifficulties]);
  const levelValues = useMemo(() => Array.from(selectedLevels), [selectedLevels]);
  const recommendedIds = useMemo(
    () => recommendedCharts.map((chart) => `${chart.songId}-${chart.difficulty}`),
    [recommendedCharts]
  );

  const queriedSongs = useLiveQuery(async () => {
    if (typeof window === "undefined") {
      return [] as Song[];
    }
    if (difficultyValues.length === 0 || levelValues.length === 0) {
      return [] as Song[];
    }

    const songs = await querySongs(searchMode, difficultyValues, levelValues, recommendedIds, normalizedQuery);

    const resultLimit = isRecommendMode ? Infinity : 50;
    const candidates = songs.reduce<{ song: Song; score: number }[]>((acc, song) => {
      const difficulty = song.difficulty as SongDifficulty;
      if (!selectedDifficulties.has(difficulty)) return acc;
      if (!selectedLevels.has(song.level)) return acc;
      if (!normalizedQuery) {
        acc.push({ song, score: 0 });
        return acc;
      }
      const normalizedTitle = normalizeSongText(song.titleNormalized ?? song.title);
      if (!normalizedTitle.includes(normalizedQuery)) {
        return acc;
      }
      const score = normalizedTitle.startsWith(normalizedQuery) ? 0 : 1;
      acc.push({ song, score });
      return acc;
    }, []);

    const sorted = candidates.sort((a, b) => a.score - b.score || a.song.title.localeCompare(b.song.title, "ja"));
    const unique: Song[] = [];
    const seen = new Set<string>();
    for (const entry of sorted) {
      const label = formatSongLabel(entry.song);
      if (seen.has(label)) {
        continue;
      }
      seen.add(label);
      unique.push(entry.song);
      if (unique.length >= resultLimit) {
        break;
      }
    }
    return unique;
  }, [
    searchMode,
    difficultyValues,
    levelValues,
    recommendedIds,
    normalizedQuery,
    selectedDifficulties,
    selectedLevels,
    formatSongLabel,
    isRecommendMode,
  ]);

  const filteredSongs = queriedSongs ?? [];
  const isLoading = queriedSongs === undefined;

  return { filteredSongs, placeholder, isLoading };
};
