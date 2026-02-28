import { Chip, Stack, useTheme } from "@mui/material";
import type { Theme } from "@mui/material/styles";

import type { Song } from "../../../schema/song";
import { DIFFICULTY_LABEL } from "../../../utils/songSearch";
import type { DifficultyKey } from "../model/songSummaryRow";
import { SONG_SUMMARY_DIFFICULTIES } from "../model/songSummaryRow";

type DifficultyChipsProps = {
  songTitle: string;
  chartsByDifficulty: Partial<Record<DifficultyKey, Song>>;
  onSelectChart?: (song: Song) => void;
};

const getDifficultyColor = (difficulty: DifficultyKey, theme: Theme) => {
  if (difficulty === "sph") {
    return theme.palette.difficulty?.hyper ?? theme.palette.warning.main;
  }
  if (difficulty === "spa") {
    return theme.palette.difficulty?.another ?? theme.palette.error.main;
  }
  return theme.palette.difficulty?.leggendaria ?? theme.palette.secondary.main;
};

export const DifficultyChips: React.FC<DifficultyChipsProps> = ({ songTitle, chartsByDifficulty, onSelectChart }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={0.75}
      useFlexGap
      sx={{ flexWrap: "wrap", justifyContent: { xs: "flex-start", sm: "flex-end" } }}
    >
      {SONG_SUMMARY_DIFFICULTIES.map((difficulty) => {
        const chart = chartsByDifficulty[difficulty];
        const baseLabel = DIFFICULTY_LABEL[difficulty];
        const label = chart ? `${baseLabel} ☆${chart.level}` : baseLabel;

        if (!chart) {
          return (
            <Chip
              key={difficulty}
              label={label}
              size="small"
              variant="outlined"
              disabled
              sx={{
                fontWeight: 600,
                borderStyle: "dashed",
              }}
            />
          );
        }

        const color = getDifficultyColor(difficulty, theme);
        return (
          <Chip
            key={difficulty}
            label={label}
            size="small"
            clickable
            onClick={() => onSelectChart?.(chart)}
            aria-label={`${songTitle} ${label} を開く`}
            sx={{
              fontWeight: 700,
              borderColor: color,
              color,
            }}
            variant="outlined"
          />
        );
      })}
    </Stack>
  );
};
