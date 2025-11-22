import { z } from "zod";

import { appDb } from "../../db/appDb";
import { songsSchema } from "../../schema/song";

export const SONGS_VERSION_META_KEY = "songsVersion";

const withBaseUrl = (relativePath: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  return `${base}${normalizedPath}`;
};

const fetchJson = async (relativePath: string) => {
  const response = await fetch(withBaseUrl(relativePath));
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

  try {
    let versionPayload: { version: string } | null = null;
    try {
      versionPayload = songsVersionSchema.parse(await fetchJson("data/songs.version.json"));
    } catch (versionError) {
      console.warn(
        "[songsSync] Failed to fetch songs.version.json, falling back to direct songs.json load",
        versionError
      );
    }

    const existingVersion = await appDb.meta.get(SONGS_VERSION_META_KEY);
    const shouldSync = versionPayload != null ? existingVersion?.value !== versionPayload.version : true;
    if (!shouldSync) {
      return;
    }

    const nextSongs = songsSchema.parse(await fetchJson("data/songs.json"));
    const nextVersionValue = versionPayload?.version ?? existingVersion?.value ?? `manual-${Date.now()}`;

    await appDb.transaction("rw", appDb.songs, appDb.meta, async () => {
      await appDb.songs.clear();
      await appDb.songs.bulkAdd(nextSongs);
      await appDb.meta.put({ key: SONGS_VERSION_META_KEY, value: nextVersionValue });
    });
  } catch (error) {
    console.error("[songsSync] Failed to synchronize songs data", error);
  }
};
