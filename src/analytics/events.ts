import ReactGA from "react-ga4";

import type { ImportErrorType } from "../features/import/hooks/useImporter";
import type { Song } from "../schema/song";
import type { PlaySide } from "../types";

type TicketListFilterMode = "recommend" | "all";

type TrackTextageClickFromTicketListParams = {
  readonly filterMode: TicketListFilterMode;
  readonly songTitle: string;
  readonly difficulty: Song["difficulty"];
  readonly laneText: string;
  readonly playSide: PlaySide;
};

export const trackTextageClickFromTicketList = ({
  filterMode,
  songTitle,
  difficulty,
  laneText,
  playSide,
}: TrackTextageClickFromTicketListParams) => {
  const eventName = filterMode === "recommend" ? "click_textage_link_recommend" : "click_textage_link_all";
  ReactGA.event(eventName, {
    song_title: songTitle,
    difficulty,
    lane_text: laneText,
    play_side: playSide,
  });
};

export const trackTicketsImportSuccess = (importedCount: number) => {
  ReactGA.event("import_tickets_success", {
    imported_count: importedCount,
  });
};

type TrackTicketsImportFailedParams = {
  readonly errorType: ImportErrorType;
  readonly inputSize: number;
};

export const trackTicketsImportFailed = ({ errorType, inputSize }: TrackTicketsImportFailedParams) => {
  ReactGA.event("import_tickets_failed", {
    error_type: errorType,
    input_size: inputSize,
  });
};

export const trackManualImport = () => {
  ReactGA.event({
    category: "User",
    action: "manual_import",
  });
};

type TrackTextageClickFromMemosParams = {
  readonly songId: string;
  readonly songTitle?: string;
  readonly difficulty: Song["difficulty"];
  readonly laneText: string;
};

export const trackTextageClickFromMemos = ({
  songId,
  songTitle,
  difficulty,
  laneText,
}: TrackTextageClickFromMemosParams) => {
  ReactGA.event("click_textage_link_from_memos_page", {
    song_id: songId,
    song_title: songTitle,
    difficulty,
    lane_text: laneText,
  });
};

export const trackFeedbackClick = () => {
  ReactGA.event({
    category: "UserAction",
    action: "Click Google Form (Header)",
  });
};

type TrackSaveMemoParams = {
  readonly songId: string;
  readonly songTitle: string;
  readonly playSide: PlaySide;
  readonly difficulty: Song["difficulty"];
  readonly laneText: string;
};

export const trackSaveMemo = ({ songId, songTitle, playSide, difficulty, laneText }: TrackSaveMemoParams) => {
  ReactGA.event("save_memo", {
    song_id: songId,
    song_title: songTitle,
    play_side: playSide,
    difficulty,
    lane_text: laneText,
  });
};

export const trackHashtagClick = () => {
  ReactGA.event({
    category: "UserAction",
    action: "Click Hashtag",
  });
};

type TrackTextageClickFromDetailParams = {
  readonly songTitle: string;
  readonly difficulty: Song["difficulty"];
  readonly laneText: string;
  readonly playSide: PlaySide;
};

export const trackTextageClickFromDetail = ({
  songTitle,
  difficulty,
  laneText,
  playSide,
}: TrackTextageClickFromDetailParams) => {
  ReactGA.event("click_textage_link_from_detail", {
    song_title: songTitle,
    difficulty,
    lane_text: laneText,
    play_side: playSide,
  });
};

type TrackTextageClickFromSongDetailParams = {
  readonly songId: string;
  readonly songTitle: string;
  readonly difficulty: Song["difficulty"];
  readonly laneText: string;
};

export const trackTextageClickFromSongDetail = ({
  songId,
  songTitle,
  difficulty,
  laneText,
}: TrackTextageClickFromSongDetailParams) => {
  ReactGA.event("click_textage_link_from_song_detail", {
    song_id: songId,
    song_title: songTitle,
    difficulty,
    lane_text: laneText,
  });
};
