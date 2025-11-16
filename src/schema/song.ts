import { z } from "zod";

export const difficultySchema = z.enum(["spb", "spn", "sph", "spa", "spl"]);

export const songSchema = z.object({
  id: z.string(),
  songId: z.string(),
  title: z.string(),
  titleNormalized: z.string(),
  version: z.number().int().min(-1),
  url: z.url(),
  difficulty: difficultySchema,
  level: z.number().int().min(1).max(12),
});

export const songsSchema = z.array(songSchema);

export type Song = z.infer<typeof songSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
