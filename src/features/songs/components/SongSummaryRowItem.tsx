import { Box, ListItem, Typography } from "@mui/material";

import type { Song } from "../../../schema/song";
import type { SongSummaryRow } from "../model/songSummaryRow";
import { DifficultyChips } from "./DifficultyChips";

type SongSummaryRowItemProps = {
  row: SongSummaryRow;
  onSelectChart?: (song: Song) => void;
};

export const SongSummaryRowItem: React.FC<SongSummaryRowItemProps> = ({ row, onSelectChart }) => {
  return (
    <ListItem
      disablePadding
      sx={{
        px: 1.5,
        py: 1,
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body1" fontWeight={500} sx={{ wordBreak: "break-word" }}>
          {row.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.versionName}
        </Typography>
      </Box>
      <DifficultyChips
        songTitle={row.title}
        chartsByDifficulty={row.chartsByDifficulty}
        onSelectChart={onSelectChart}
      />
    </ListItem>
  );
};
