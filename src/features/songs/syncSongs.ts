import { z } from "zod";

import { appDb } from "../../db/appDb";
import { songsSchema } from "../../schema/song";

export const SONGS_VERSION_META_KEY = "songsVersion";

const withBaseUrl = (relativePath: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  return `${base}${normalizedPath}`;
};

const fetchJson = async (relativePath: string, init?: RequestInit) => {
  const response = await fetch(withBaseUrl(relativePath), {
    cache: "no-store",
    ...init,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${relativePath}: ${response.status}`);
  }
  return response.json() as Promise<unknown>;
};

const songsVersionSchema = z.object({
  version: z.string(),
  count: z.number().int().nonnegative(),
});

export const syncSongsIfNeeded = async (): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  let versionPayload: z.infer<typeof songsVersionSchema>;
  try {
    versionPayload = songsVersionSchema.parse(await fetchJson("data/songs.version.json"));
  } catch {
    // オフラインやネットワークエラー時は現行データをそのまま使う
    return;
  }
  const existingVersion = await appDb.meta.get(SONGS_VERSION_META_KEY);
  const shouldSync = existingVersion?.value !== versionPayload.version;
  if (!shouldSync) {
    return;
  }

  let nextSongs: z.infer<typeof songsSchema>;
  try {
    nextSongs = songsSchema.parse(await fetchJson("data/songs.json"));
  } catch {
    // 新バージョンが検知されても取得に失敗した場合は現行データを維持する
    return;
  }

  await appDb.transaction("rw", appDb.songs, appDb.meta, async () => {
    await appDb.songs.clear();
    await appDb.songs.bulkAdd(nextSongs);
    await appDb.meta.put({ key: SONGS_VERSION_META_KEY, value: versionPayload.version });
  });
};
