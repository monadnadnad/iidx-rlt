import { Divider, Stack } from "@mui/material";
import React from "react";

import type { Song } from "../../../../schema/song";
import type { PlaySide } from "../../../../types";
import type { FilterMode } from "../../model/search";
import { PatternInput } from "./PatternInput";
import { PlaySideSwitch } from "./PlaySideSwitch";
import { SongSelect } from "./SongSelect";
import type { RecommendedSong } from "../../hooks/useTextageSongOptions";

type TicketFilterPanelProps = {
  playSide: PlaySide;
  onPlaySideChange: (side: PlaySide) => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  selectedSong: Song | null;
  onSongSelect: (song: Song | null) => void;
  recommendedSongs: ReadonlyArray<RecommendedSong>;
};

export const TicketFilterPanel: React.FC<TicketFilterPanelProps> = ({
  playSide,
  onPlaySideChange,
  filterMode,
  onFilterModeChange,
  selectedSong,
  onSongSelect,
  recommendedSongs,
}) => (
  <Stack spacing={2} sx={{ width: "100%" }}>
    <PlaySideSwitch value={playSide} onChange={onPlaySideChange} />
    <PatternInput playSide={playSide} />
    <Divider />
    <SongSelect
      recommendedSongs={recommendedSongs}
      selectedSong={selectedSong}
      onSongSelect={onSongSelect}
      searchMode={filterMode}
      onModeChange={onFilterModeChange}
    />
  </Stack>
);
