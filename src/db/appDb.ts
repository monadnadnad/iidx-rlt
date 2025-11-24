import Dexie, { type Table } from "dexie";

import type { Song } from "../schema/song";
import type { Memo } from "../schema/memo";
import { resolveVersionName, VERSION_NAMES } from "../utils/version";

export type SongRow = Song;
export type MemoRow = Memo;

export interface MetaRow {
  key: string;
  value: string;
}

class AppDB extends Dexie {
  songs!: Table<SongRow, string>;
  memos!: Table<MemoRow, [string, string, string]>;
  meta!: Table<MetaRow, string>;

  constructor() {
    super("songs-db");

    this.version(1).stores({
      songs: "id, songId, [songId+difficulty]",
      meta: "key",
    });

    this.version(2)
      .stores({
        songs: "id, songId, [songId+difficulty], difficulty, level, [difficulty+level], titleNormalized",
        meta: "key",
      })
      .upgrade(async (transaction) => {
        const songsTable = transaction.table<SongRow, string>("songs");
        await songsTable
          .filter((song: SongRow) => song.titleNormalized == null && song.title != null)
          .modify((song: SongRow) => {
            song.titleNormalized = song.title;
          });
      });

    this.version(3)
      .stores({
        songs:
          "id, songId, [songId+difficulty], difficulty, level, [difficulty+level], titleNormalized, version, versionName",
        memos: "[songId+difficulty+laneText], songId, [songId+difficulty], updatedAt",
        meta: "key",
      })
      .upgrade(async (transaction) => {
        const songsTable = transaction.table<SongRow, string>("songs");
        await songsTable
          .filter((song: SongRow) => song.versionName == null && song.version != null)
          .modify((song: SongRow) => {
            song.versionName = resolveVersionName(song.version, VERSION_NAMES);
          });
      });

    this.table<SongRow, string>("songs").hook("creating", (_primKey, obj) => {
      if (!obj.titleNormalized && obj.title) {
        obj.titleNormalized = obj.title;
      }
      if (!obj.versionName && obj.version != null) {
        obj.versionName = resolveVersionName(obj.version, VERSION_NAMES);
      }
    });
  }
}

export const appDb = new AppDB();
