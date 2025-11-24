import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { appDb } from "../../db/appDb";
import type { Memo } from "../../schema/memo";
import type { Song } from "../../schema/song";

type UseSongMemoParams = {
  songId: string;
  difficulty: Song["difficulty"];
};

export const useSongMemo = ({ songId, difficulty }: UseSongMemoParams) => {
  const memos = useLiveQuery(async () => {
    if (!songId || !difficulty || typeof window === "undefined") {
      return [] as Memo[];
    }
    return appDb.memos.where("[songId+difficulty]").equals([songId, difficulty]).sortBy("updatedAt");
  }, [songId, difficulty]);

  const saveMemo = useCallback(
    async (laneText: string) => {
      const trimmed = laneText.trim();

      if (!trimmed) {
        return;
      }

      const next: Memo = {
        songId,
        difficulty,
        laneText: trimmed,
        updatedAt: new Date().toISOString(),
      };

      await appDb.memos.put(next);
    },
    [songId, difficulty]
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
