import { getTheme } from "./theme";
import type { AtariRule as SchemaAtariRule, SearchPattern as SchemaSearchPattern, Song as SchemaSong } from "./schema";

export interface Ticket {
  laneText: string;
  expiration?: string;
}

const _theme = getTheme("light");
export type HighlightColor = keyof typeof _theme.palette.highlight | undefined;

export type SearchPattern = SchemaSearchPattern;

export type PlaySide = "1P" | "2P";

export type SongInfo = Pick<SchemaSong, "id" | "songId" | "title" | "url" | "difficulty" | "level">;

export type AtariRule = SchemaAtariRule;

export interface AppSettings {
  playSide: PlaySide;
}

export interface AppNavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export type FilterMode = "recommend" | "all";

export type TicketQuery = SearchPattern & {
  filterMode: FilterMode;
  textageSong: SongInfo | null;
  itemsPerPage: number;
  currentPage: number;
};
