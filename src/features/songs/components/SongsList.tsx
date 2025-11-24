import { Box, Chip, List, ListItem, ListItemButton, Typography, useTheme } from "@mui/material";
import type { Song } from "../../../schema/song";

import { DIFFICULTY_LABEL } from "../../../utils/songSearch";

const formatDifficulty = (difficulty: Song["difficulty"], level: number) =>
  `${DIFFICULTY_LABEL[difficulty]} / ☆${level}`;

type SongsListProps = {
  songs: Song[];
  onSelect?: (song: Song) => void;
};

export const SongsList: React.FC<SongsListProps> = ({ songs, onSelect }) => {
  const theme = useTheme();
  const difficultyColor: Record<Song["difficulty"], string> = {
    spb: theme.palette.info.main,
    spn: theme.palette.info.main,
    sph: theme.palette.difficulty.hyper,
    spa: theme.palette.difficulty.another,
    spl: theme.palette.difficulty.leggendaria,
  };

  return (
    <Box sx={{ overflowX: "auto" }}>
      <List
        disablePadding
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
          "& > li:not(:last-of-type)": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      >
        {songs.map((chart) => (
          <ListItem key={chart.id} disablePadding>
            <ListItemButton
              onClick={() => onSelect?.(chart)}
              sx={{
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500} sx={{ wordBreak: "break-word" }}>
                  {chart.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {chart.versionName}
                </Typography>
              </Box>
              <Chip
                label={formatDifficulty(chart.difficulty, chart.level)}
                size="small"
                variant="outlined"
                sx={{
                  flexShrink: 0,
                  fontWeight: 600,
                  borderColor: difficultyColor[chart.difficulty],
                  color: difficultyColor[chart.difficulty],
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
