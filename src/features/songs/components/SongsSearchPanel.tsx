import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { ChangeEvent } from "react";

import type { Song } from "../../../schema/song";
import type { SongsSearchState } from "../hooks/useSongsQuery";
import { VERSION_NAMES } from "../../../utils/version";
import {
  SONG_FILTER_DIFFICULTY_OPTIONS,
  SONG_FILTER_LEVEL_OPTIONS,
  createInitialSongSearchState,
  toggleSetValue,
} from "../../../utils/songSearch";

type SongsSearchPanelProps = {
  value: SongsSearchState;
  onChange: (next: SongsSearchState) => void;
  disableAtariFilter?: boolean;
};

const versionOptions = [...VERSION_NAMES].reverse();

export const SongsSearchPanel: React.FC<SongsSearchPanelProps> = ({ value, onChange, disableAtariFilter }) => {
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, title: event.target.value });
  };

  const handleVersionChange = (_: unknown, newValue: string | null) => {
    onChange({ ...value, version: newValue ?? "" });
  };

  const handleDifficultyToggle = (difficulty: Song["difficulty"]) => {
    onChange({ ...value, difficulties: toggleSetValue(value.difficulties, difficulty) });
  };

  const handleLevelToggle = (level: number) => {
    onChange({ ...value, levels: toggleSetValue(value.levels, level) });
  };

  const handleAtariToggle = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange({ ...value, onlyWithAtari: checked });
  };

  const handleReset = () => {
    onChange(createInitialSongSearchState());
  };

  return (
    <Stack spacing={1}>
      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1} alignItems="center">
        <TextField
          size="small"
          label="曲名で検索"
          placeholder="例: 冥"
          value={value.title}
          onChange={handleTitleChange}
          fullWidth
        />
        <Autocomplete
          size="small"
          options={versionOptions}
          value={value.version}
          onChange={handleVersionChange}
          renderInput={(params) => <TextField {...params} label="収録バージョン" />}
          clearOnEscape
          fullWidth
        />
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1} alignItems="start">
        <FormGroup row>
          {SONG_FILTER_DIFFICULTY_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  size="small"
                  checked={value.difficulties.has(option.value)}
                  onChange={() => handleDifficultyToggle(option.value)}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>

        <FormGroup row>
          {SONG_FILTER_LEVEL_OPTIONS.map((level) => (
            <FormControlLabel
              key={level}
              control={
                <Checkbox size="small" checked={value.levels.has(level)} onChange={() => handleLevelToggle(level)} />
              }
              label={`☆${level}`}
            />
          ))}
        </FormGroup>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={value.onlyWithAtari}
              onChange={handleAtariToggle}
              disabled={disableAtariFilter}
            />
          }
          label={
            <Typography variant="body2" fontSize={14}>
              当たり配置定義済み
            </Typography>
          }
          sx={{ m: 0, whiteSpace: "nowrap" }}
        />
        <Button
          variant="text"
          size="small"
          startIcon={<FilterAltOffIcon />}
          onClick={handleReset}
          sx={{ justifySelf: "end" }}
        >
          条件リセット
        </Button>
      </Box>
    </Stack>
  );
};
