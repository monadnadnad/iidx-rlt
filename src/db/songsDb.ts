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
  }
}

export const songsDb = new SongsDB();
