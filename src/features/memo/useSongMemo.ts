import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

import { useSettingsStore } from "../../store/settingsStore";

import { trackSaveMemo } from "../../analytics/events";
import { appDb } from "../../db/appDb";
import type { Memo } from "../../schema/memo";
import type { Song } from "../../schema/song";

type UseSongMemoParams = {
  readonly songId: string;
  readonly difficulty: Song["difficulty"];
  readonly songTitle: string;
};

export const useSongMemo = ({ songId, difficulty, songTitle }: UseSongMemoParams) => {
  const playSide = useSettingsStore((s) => s.playSide);
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

      trackSaveMemo({
        songId,
        songTitle,
        playSide,
        difficulty,
        laneText: trimmed,
      });
    },
    [songId, difficulty, songTitle, playSide]
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
