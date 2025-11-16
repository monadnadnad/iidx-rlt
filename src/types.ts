import { getTheme } from "./theme";
import type { Song } from "./schema/song";
import type { AtariRule as SchemaAtariRule } from "./schema/atari-rule";

export interface Ticket {
  laneText: string;
  expiration?: string;
}

const _theme = getTheme("light");
export type HighlightColor = keyof typeof _theme.palette.highlight | undefined;

export type SearchPattern = {
  scratchSideText: string;
  isScratchSideUnordered: boolean;
  nonScratchSideText: string;
  isNonScratchSideUnordered: boolean;
};

export type PlaySide = "1P" | "2P";

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
  textageSong: Song | null;
  itemsPerPage: number;
  currentPage: number;
};
