import { useLiveQuery } from "dexie-react-hooks";

import { appDb } from "../../db/appDb";
import type { Memo } from "../../schema/memo";
import type { Song } from "../../schema/song";

export type MemoWithSong = Memo & { song?: Song };

export const useMemos = () => {
  const memos = useLiveQuery<MemoWithSong[]>(async () => {
    if (typeof window === "undefined") return [];

    const rows = await appDb.memos.orderBy("laneText").toArray();
    if (rows.length === 0) return [] as MemoWithSong[];

    const songIds = Array.from(new Set(rows.map((m) => m.songId)));
    const songs = await appDb.songs.where("songId").anyOf(songIds).toArray();
    const songMap = new Map<string, Song>();
    songs.forEach((s) => songMap.set(`${s.songId}-${s.difficulty}`, s));

    return rows.map((m) => ({ ...m, song: songMap.get(`${m.songId}-${m.difficulty}`) }));
  }, []);

  return memos ?? [];
};
