import { z } from "zod";

export const difficultySchema = z.enum(["spb", "spn", "sph", "spa", "spl"]);

export const songSchema = z.object({
  id: z.string(),
  songId: z.string(),
  title: z.string(),
  artist: z.string(),
  genre: z.string(),
  version: z.number().int().min(-1),
  textageUrl: z.url(),
  difficulty: difficultySchema,
  level: z.number().int().min(1).max(12),
  notes: z.number().int().positive(),
  bpm: z.object({ min: z.number(), max: z.number() }),
});

export const songsSchema = z.array(songSchema);

export type Song = z.infer<typeof songSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
