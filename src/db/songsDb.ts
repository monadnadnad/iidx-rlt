import Dexie, { type Table } from "dexie";

import type { Song } from "../schema/song";

export type SongRow = Song;

export interface MetaRow {
  key: string;
  value: string;
}

class SongsDB extends Dexie {
  songs!: Table<SongRow, string>;
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
  }
}

export const songsDb = new SongsDB();
