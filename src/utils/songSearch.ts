import type { Song } from "../schema/song";

export const normalizeSongText = (value: string) => value.replace(/\s+/g, "").normalize("NFKC").toLowerCase();

export const DIFFICULTY_LABEL: Record<Song["difficulty"], string> = {
  spb: "SPB",
  spn: "SPN",
  sph: "SPH",
  spa: "SPA",
  spl: "SPL",
};

const MAIN_DIFFICULTIES = ["sph", "spa", "spl"] as const;

export const DEFAULT_CHART_DIFFICULTIES: Array<Song["difficulty"]> = [...MAIN_DIFFICULTIES];

export const SONG_FILTER_DIFFICULTY_OPTIONS = MAIN_DIFFICULTIES.map((value) => ({
  value,
  label: DIFFICULTY_LABEL[value],
}));

export const SONG_FILTER_LEVEL_OPTIONS: ReadonlyArray<number> = [10, 11, 12] as const;

export const createInitialSongSearchState = () => ({
  title: "",
  version: "",
  difficulties: new Set(SONG_FILTER_DIFFICULTY_OPTIONS.map((o) => o.value)),
  levels: new Set(SONG_FILTER_LEVEL_OPTIONS),
  onlyWithAtari: false,
});

export const toggleSetValue = <T>(source: Set<T>, value: T): Set<T> => {
  const next = new Set(source);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
};

export const buildDifficultyLevelPairs = (difficulties: Song["difficulty"][], levels: number[]) => {
  const pairs: [Song["difficulty"], number][] = [];
  for (const difficulty of difficulties) {
    for (const level of levels) {
      pairs.push([difficulty, level]);
    }
  }
  return pairs;
};
