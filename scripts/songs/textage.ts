import { z } from "zod";

import type { Difficulty } from "../../src/schema/song";

export const TEXTAGE_BASE_URL = "https://textage.cc/score";

export const textagePlayModeSchema = z.enum(["1", "D"] as const);
export type TextagePlayMode = z.infer<typeof textagePlayModeSchema>;

export const textageDifficultyCodeSchema = z.enum(["P", "N", "H", "A", "X"] as const);
export type TextageDifficultyCode = z.infer<typeof textageDifficultyCodeSchema>;

const levelCodeFromNumberSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(12)
  .transform((value) => value.toString(16).toUpperCase());

const levelCodeFromStringSchema = z
  .string()
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[1-9A-C]$/.test(value), "Textage level code must be hex 1-9 or A-C");

export const textageLevelCodeSchema = z.union([levelCodeFromNumberSchema, levelCodeFromStringSchema]);
export type TextageLevelCode = z.infer<typeof textageLevelCodeSchema>;

export const textageVersionCodeSchema = z.union([z.literal("s"), z.coerce.number().int().min(0).transform(String)]);
export type TextageVersionCode = z.infer<typeof textageVersionCodeSchema>;

const textageTagSchema = z.string().min(1);

const difficultyCodeBySongDifficulty: Record<Difficulty, TextageDifficultyCode> = {
  spb: "P",
  spn: "N",
  sph: "H",
  spa: "A",
  spl: "X",
};

const toTextageVersionCode = (version: number): string => {
  if (version < -1) {
    throw new Error(`Textage version codeに変換できない値です: ${version}`);
  }

  if (version === -1) return "0";
  if (version === 0) return "1";
  if (version === 1) return "s";

  return textageVersionCodeSchema.parse(version);
};

export type CreateTextageUrlParams = {
  version: number;
  textageTag: string;
  difficulty: Difficulty;
  level: number;
};

export const createTextageUrl = ({ version, textageTag, difficulty, level }: CreateTextageUrlParams): string => {
  const difficultyCode = difficultyCodeBySongDifficulty[difficulty];
  if (!difficultyCode) {
    throw new Error(`Textage difficulty codeが未定義の譜面です: ${difficulty}`);
  }

  const versionCode = textageVersionCodeSchema.parse(toTextageVersionCode(version));
  const validatedTag = textageTagSchema.parse(textageTag);
  const playMode = textagePlayModeSchema.parse("1");
  const parsedDifficultyCode = textageDifficultyCodeSchema.parse(difficultyCode);
  const levelCode = textageLevelCodeSchema.parse(level);

  const query = `${playMode}${parsedDifficultyCode}${levelCode}00`;
  return `${TEXTAGE_BASE_URL}/${versionCode}/${validatedTag}.html?${query}`;
};
