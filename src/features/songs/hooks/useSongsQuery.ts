import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Song } from "../../../schema/song";
import { appDb } from "../../../db/appDb";
import { buildDifficultyLevelPairs, normalizeSongText } from "../../../utils/songSearch";

export type SongsSearchState = {
  title: string;
  version: string;
  difficulties: Set<Song["difficulty"]>;
  levels: Set<number>;
  onlyWithAtari: boolean;
};

export const DIFFICULTY_ORDER: Array<Song["difficulty"]> = ["spb", "spn", "sph", "spa", "spl"];

const difficultyRank = (difficulty: Song["difficulty"]) => {
  const idx = DIFFICULTY_ORDER.indexOf(difficulty);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

const sortSongs = (a: Song, b: Song) => {
  const titleA = a.titleNormalized ?? a.title;
  const titleB = b.titleNormalized ?? b.title;
  return titleA.localeCompare(titleB, "ja") || difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
};

type SongsQueryOptions = {
  searchState: SongsSearchState;
  hasAtariRuleForSong?: (song: Song) => boolean;
};

export const useSongsQuery = ({ searchState, hasAtariRuleForSong }: SongsQueryOptions) => {
  const normalizedTitle = useMemo(() => normalizeSongText(searchState.title), [searchState.title]);
  const normalizedVersion = useMemo(() => normalizeSongText(searchState.version), [searchState.version]);
  const difficultyValues = useMemo(() => Array.from(searchState.difficulties), [searchState.difficulties]);
  const levelValues = useMemo(() => Array.from(searchState.levels), [searchState.levels]);
  const onlyWithAtari = searchState.onlyWithAtari && !!hasAtariRuleForSong;

  const songs = useLiveQuery(async () => {
    if (typeof window === "undefined") {
      return [] as Song[];
    }

    if (difficultyValues.length === 0 || levelValues.length === 0) {
      return [] as Song[];
    }

    const pairs = buildDifficultyLevelPairs(difficultyValues, levelValues);
    let collection = appDb.songs.where("[difficulty+level]").anyOf(pairs);

    if (normalizedTitle) {
      collection = collection.filter((song) =>
        normalizeSongText(song.titleNormalized ?? song.title).includes(normalizedTitle)
      );
    }

    if (normalizedVersion) {
      collection = collection.filter((song) => normalizeSongText(song.versionName).includes(normalizedVersion));
    }

    if (onlyWithAtari) {
      collection = collection.filter((song) => hasAtariRuleForSong(song));
    }

    const result = await collection.toArray();
    return result.sort(sortSongs);
  }, [normalizedTitle, normalizedVersion, difficultyValues, levelValues, onlyWithAtari, hasAtariRuleForSong]);

  return {
    songs: songs ?? [],
    isLoading: songs === undefined,
  } as const;
};
