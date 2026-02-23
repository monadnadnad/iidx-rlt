import {
  Autocomplete,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useState } from "react";

import type { Song } from "../../../../schema/song";
import { SONG_FILTER_LEVEL_OPTIONS, toggleSetValue } from "../../../../utils/songSearch";
import type { FilterMode } from "../../filterMode";
import { useTextageSongOptions, type RecommendedSong, type SongDifficulty } from "../../hooks/useTextageSongOptions";
import { TextageFilterSection, type TextageFilterOption } from "../TextageFilterSection";

const DIFFICULTY_OPTIONS: ReadonlyArray<{ label: string; value: SongDifficulty }> = [
  { label: "SPH", value: "sph" },
  { label: "SPA", value: "spa" },
  { label: "SPL", value: "spl" },
];

type SongSelectProps = {
  recommendedSongs: ReadonlyArray<RecommendedSong>;
  selectedSong: Song | null;
  onSongSelect?: (_song: Song | null) => void;
  searchMode: FilterMode;
  onModeChange?: (_mode: FilterMode) => void;
};

export const SongSelect: React.FC<SongSelectProps> = ({
  recommendedSongs,
  selectedSong,
  onSongSelect,
  searchMode,
  onModeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [inputValue, setInputValue] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<SongDifficulty>>(
    () => new Set(DIFFICULTY_OPTIONS.map((option) => option.value))
  );
  const [selectedLevels, setSelectedLevels] = useState<Set<number>>(() => new Set(SONG_FILTER_LEVEL_OPTIONS));

  const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: FilterMode | null) => {
    if (newMode !== null) {
      onModeChange?.(newMode);
      onSongSelect?.(null);
    }
  };

  const formatSongLabel = useCallback(
    (song: Song) => `${song.title} [${song.difficulty.toUpperCase().replace("SP", "")}]`,
    []
  );

  const { filteredSongs, placeholder, isLoading } = useTextageSongOptions({
    recommendedSongs,
    searchMode,
    selectedDifficulties,
    selectedLevels,
    inputValue,
    formatSongLabel,
  });

  const handleLevelToggle = (level: number) => {
    setSelectedLevels((prev) => {
      const next = toggleSetValue(prev, level);
      if (selectedSong && !next.has(selectedSong.level)) {
        onSongSelect?.(null);
      }
      return next;
    });
  };

  const handleDifficultyToggle = (difficulty: SongDifficulty) => {
    setSelectedDifficulties((prev) => {
      const next = toggleSetValue(prev, difficulty);
      if (selectedSong && !next.has(selectedSong.difficulty as SongDifficulty)) {
        onSongSelect?.(null);
      }
      return next;
    });
  };

  return (
    <Stack spacing={3}>
      <ToggleButtonGroup
        value={searchMode}
        exclusive
        onChange={handleModeChange}
        aria-label="search mode"
        size={isMobile ? "medium" : "large"}
        color="primary"
        sx={{ alignSelf: isMobile ? "stretch" : "flex-start" }}
      >
        <ToggleButton value="recommend" aria-label="recommend search">
          おすすめから検索
        </ToggleButton>
        <ToggleButton value="all" aria-label="all songs search">
          全楽曲から検索
        </ToggleButton>
      </ToggleButtonGroup>
      <Stack direction="row" spacing={2} useFlexGap sx={{ width: "100%", flexWrap: "wrap" }}>
        <TextageFilterSection
          title="難易度で絞り込み"
          options={DIFFICULTY_OPTIONS.map<TextageFilterOption>((option) => ({
            key: option.value,
            label: option.label,
            checked: selectedDifficulties.has(option.value),
            onToggle: () => handleDifficultyToggle(option.value),
          }))}
        />
        <TextageFilterSection
          title="レベルで絞り込み"
          options={SONG_FILTER_LEVEL_OPTIONS.map<TextageFilterOption>((level) => ({
            key: level,
            label: `Lv. ${level}`,
            checked: selectedLevels.has(level),
            onToggle: () => handleLevelToggle(level),
          }))}
        />
      </Stack>
      <Autocomplete
        options={filteredSongs}
        getOptionLabel={formatSongLabel}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedSong}
        onChange={(_event, newValue) => onSongSelect?.(newValue)}
        inputValue={inputValue}
        onInputChange={(_event, value) => setInputValue(value)}
        filterOptions={(options) => options}
        loading={isLoading}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {formatSongLabel(option)}
          </li>
        )}
        slotProps={{ listbox: { sx: { maxHeight: isMobile ? "25vh" : "40vh" } } }}
        renderInput={(params) => <TextField {...params} label="楽曲を選択" placeholder={placeholder} />}
      />
    </Stack>
  );
};
