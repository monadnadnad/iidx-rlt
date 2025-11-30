import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";
import ReactGA from "react-ga4";

import { appDb } from "../../db/appDb";
import type { Memo } from "../../schema/memo";
import type { Song } from "../../schema/song";

type UseSongMemoParams = {
  readonly songId: string;
  readonly difficulty: Song["difficulty"];
  readonly songTitle?: string;
};

export const useSongMemo = ({ songId, difficulty, songTitle }: UseSongMemoParams) => {
  const memos = useLiveQuery(async () => {
    if (!songId || !difficulty || typeof window === "undefined") {
      return [] as Memo[];
    }
    return appDb.memos.where("[songId+difficulty]").equals([songId, difficulty]).sortBy("updatedAt");
  }, [songId, difficulty]);

  const saveMemo = useCallback(
    async (laneText: string) => {
      const trimmed = laneText.trim();

      if (!trimmed) return;

      const next: Memo = {
        songId,
        difficulty,
        laneText: trimmed,
        updatedAt: new Date().toISOString(),
      };

      await appDb.memos.put(next);

      ReactGA.event("save_memo", {
        song_id: songId,
        song_title: songTitle,
        difficulty,
        lane_text: trimmed,
      });
    },
    [songId, difficulty, songTitle]
  );

  const deleteMemo = useCallback(
    async (laneText: string) => {
      type MemoKey = [string, Song["difficulty"], string];
      const key: MemoKey = [songId, difficulty, laneText];
      await appDb.memos.delete(key);
    },
    [songId, difficulty]
  );

  return {
    memos: memos ?? [],
    saveMemo,
    deleteMemo,
  } as const;
};
