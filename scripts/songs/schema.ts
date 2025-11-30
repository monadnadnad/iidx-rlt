import { z } from "zod";

import type { Song } from "../../src/schema/song";
import { Difficulty, songsSchema } from "../../src/schema/song";
import { resolveVersionName } from "../../src/utils/version";
import { createTextageUrl } from "./textage";

export const TARGET_LEVELS = [10, 11, 12] as const;
export const TARGET_DIFFICULTIES: Difficulty[] = ["sph", "spa", "spl"];

const SP_DIFFICULTY_INDEX: Record<Difficulty, number> = {
  spb: 0,
  spn: 1,
  sph: 2,
  spa: 3,
  spl: 4,
};

const tupleOfFive = <T extends z.ZodTypeAny>(schema: T) => z.tuple([schema, schema, schema, schema, schema] as const);

const bpmRangeSchema = z.tuple([z.number(), z.number()]);
const bpmSingleSchema = z.union([z.number(), bpmRangeSchema]);
const bpmPerDifficultyTupleSchema = tupleOfFive(bpmSingleSchema);
const levelValueSchema = z.union([z.literal(0), z.number().int().min(1).max(12)]);
const levelTupleSchema = tupleOfFive(levelValueSchema);
const notesValueSchema = z.number().int().min(0);
const notesTupleSchema = tupleOfFive(notesValueSchema);

const bpmPerDifficultyObjectSchema = z.strictObject({
  sp: bpmPerDifficultyTupleSchema,
  dp: bpmPerDifficultyTupleSchema,
});

const levelObjectSchema = z.strictObject({
  sp: levelTupleSchema,
  dp: levelTupleSchema,
});

const notesObjectSchema = z.strictObject({
  sp: notesTupleSchema,
  dp: notesTupleSchema,
});

export const iidxDataTableChartInfoValueSchema = z.strictObject({
  bpm: z.union([bpmSingleSchema, bpmPerDifficultyObjectSchema]),
  in_ac: z.boolean(),
  in_inf: z.boolean(),
  level: levelObjectSchema,
  notes: notesObjectSchema,
});

export const iidxDataTableTitleSchema = z.record(z.string(), z.string());
export const iidxDataTableNormalizedTitleSchema = z.record(z.string(), z.string());
export const iidxDataTableTextageTagSchema = z.record(z.string(), z.string());
export const iidxDataTableChartInfoSchema = z.record(z.string(), iidxDataTableChartInfoValueSchema);
export const iidxDataTableChartInfoWithIdSchema = iidxDataTableChartInfoValueSchema.extend({ id: z.string() });
export const versionNamesSchema = z.array(z.string());

const songMetadataSchema = z.strictObject({
  artist: z.string(),
  genre: z.string(),
  version: z.number().int().min(-1), // -1: CS, 0: 1st style, 1: substream, 2: 2nd style, ...
});

export const iidxDataTableSongInfoSchema = z.record(z.string(), songMetadataSchema);
export type SongMetadata = z.infer<typeof songMetadataSchema>;

export type ChartInfoDependencies = {
  titlesById: Map<string, string>;
  textageTagsById: Map<string, string>;
  songInfoById: Map<string, SongMetadata>;
  normalizedTitlesById?: Map<string, string>;
  versionNames: readonly string[];
  targetDifficulties?: readonly Difficulty[];
  targetLevels?: readonly number[];
};

export type ChartInfoRecord = z.infer<typeof iidxDataTableChartInfoSchema>;
export type ChartInfo = z.infer<typeof iidxDataTableChartInfoWithIdSchema>;

type BpmSingle = z.infer<typeof bpmSingleSchema>;

const toBpmRange = (bpm: BpmSingle) => {
  if (Array.isArray(bpm)) {
    const [min, max] = bpm;
    return { min, max };
  }
  return { min: bpm, max: bpm };
};

const resolveBpmValue = (value: ChartInfo["bpm"], index: number): BpmSingle | null => {
  if (typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 2 && value.every((entry) => typeof entry === "number")) {
      return value;
    }
    const candidate = value[index] ?? value[value.length - 1];
    return (candidate ?? null) as BpmSingle | null;
  }

  const candidate = value.sp[index] ?? value.sp[value.sp.length - 1];
  return candidate ?? null;
};

const fallbackNormalizeTitle = (value: string) => value.normalize("NFKC");

export const createChartInfoToSongsSchema = ({
  titlesById,
  textageTagsById,
  songInfoById,
  normalizedTitlesById,
  versionNames,
  targetDifficulties = TARGET_DIFFICULTIES,
  targetLevels = TARGET_LEVELS,
}: ChartInfoDependencies) =>
  iidxDataTableChartInfoWithIdSchema
    .transform((chart): Song[] => {
      const title = titlesById.get(chart.id);
      if (!title) {
        throw new Error(`title.json is missing entry for chart id "${chart.id}"`);
      }

      const textageTag = textageTagsById.get(chart.id);
      if (!textageTag) {
        throw new Error(`textage-tag.json is missing entry for chart id "${chart.id}"`);
      }

      const songInfo = songInfoById.get(chart.id);
      if (!songInfo) {
        throw new Error(`song-info.json is missing entry for chart id "${chart.id}"`);
      }

      const versionName = resolveVersionName(songInfo.version, versionNames);

      const normalizedTitle = normalizedTitlesById?.get(chart.id) ?? fallbackNormalizeTitle(title);

      const songs = targetDifficulties.flatMap((difficulty) => {
        const index = SP_DIFFICULTY_INDEX[difficulty];
        const level = chart.level.sp[index];
        if (level == null || level <= 0 || !targetLevels.includes(level)) {
          return [];
        }

        const notesValue = chart.notes.sp[index];
        if (notesValue == null || notesValue <= 0) {
          return [];
        }

        const bpmValue = resolveBpmValue(chart.bpm, index);
        if (!bpmValue) {
          return [];
        }

        const url = createTextageUrl({
          textageTag,
          difficulty,
          level,
          version: songInfo.version,
        });

        return [
          {
            id: `${chart.id}-${difficulty}`,
            songId: chart.id,
            title,
            titleNormalized: normalizedTitle,
            artist: songInfo.artist,
            genre: songInfo.genre,
            version: songInfo.version,
            versionName,
            url,
            difficulty,
            level,
            bpm: toBpmRange(bpmValue),
            notes: notesValue,
          },
        ];
      });

      return songs;
    })
    .pipe(songsSchema);

export const sortSongs = (songs: Song[]) =>
  [...songs].sort((a, b) => {
    if (a.title !== b.title) {
      return a.title.localeCompare(b.title);
    }
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return a.difficulty.localeCompare(b.difficulty);
  });
