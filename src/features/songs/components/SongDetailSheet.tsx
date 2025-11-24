import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { FloatingSheet } from "../../../components/ui/FloatingSheet";
import type { Song } from "../../../schema/song";
import { useSettingsStore } from "../../../store/settingsStore";
import type { AtariRule, PlaySide, SearchPattern } from "../../../types";
import { createLaneTextSchema } from "../../../utils/laneText";
import { DIFFICULTY_LABEL } from "../../../utils/songSearch";
import { useSongMemo } from "../../memo/useSongMemo";

type SongDetailSheetProps = {
  song: Song;
  rules: AtariRule[];
  onClose: () => void;
};

type LaneTextFormProps = {
  onSubmit: (laneText: string) => Promise<void>;
};

const LaneTextForm: React.FC<LaneTextFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(
      z.object({
        laneText: createLaneTextSchema(7, { allowWildcard: false, requireFullLength: true }),
      })
    ),
    defaultValues: { laneText: "" },
  });

  const submit = handleSubmit(async ({ laneText }) => {
    await onSubmit(laneText);
    reset();
  });

  return (
    <form onSubmit={submit} style={{ width: "100%" }}>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <Controller
          name="laneText"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              size="small"
              disabled={formState.isSubmitting}
              placeholder="例: 1234576"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ flexGrow: 1, maxWidth: 220, minWidth: 160 }}
              slotProps={{
                htmlInput: {
                  maxLength: 7,
                  inputMode: "numeric",
                  pattern: "[1-7]*",
                  style: {
                    textAlign: "center",
                  },
                },
              }}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={formState.isSubmitting} sx={{ alignSelf: "flex-start" }}>
          追加
        </Button>
      </Stack>
    </form>
  );
};

export const SongDetailSheet: React.FC<SongDetailSheetProps> = ({ song, rules, onClose }) => {
  const { memos, saveMemo, deleteMemo } = useSongMemo({
    songId: song.songId,
    difficulty: song.difficulty,
  });
  const playSide = useSettingsStore((s) => s.playSide);

  const formatPattern = (pattern: SearchPattern, side: PlaySide) => {
    return side === "1P"
      ? `${pattern.scratchSideText} | ${pattern.nonScratchSideText}`
      : `${pattern.nonScratchSideText} | ${pattern.scratchSideText}`;
  };

  const sheetTitle = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Stack>
        <Typography variant="h6" component="span" fontSize="1.2rem">
          {song.title}
        </Typography>
        <Typography component="span" sx={{ color: "text.secondary" }}>
          {DIFFICULTY_LABEL[song.difficulty]} ☆{song.level}
        </Typography>
      </Stack>
      <IconButton onClick={onClose} aria-label="閉じる" sx={{ justifySelf: "flex-end", ml: "auto" }}>
        <CloseIcon />
      </IconButton>
    </Box>
  );

  return (
    <FloatingSheet open onClose={onClose} title={sheetTitle}>
      <Stack spacing={2} sx={{ minHeight: 0 }}>
        {rules.length > 0 && (
          <>
            <List dense sx={{ maxHeight: 150, overflowY: "auto" }}>
              {rules.flatMap((rule) =>
                rule.patterns.map((pattern, idx) => (
                  <ListItem key={idx} disableGutters>
                    <ListItemText primary={formatPattern(pattern, playSide)} secondary={rule.description} />
                  </ListItem>
                ))
              )}
            </List>
            <Divider />
          </>
        )}

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            配置メモ
          </Typography>
          <LaneTextForm key={song.id} onSubmit={saveMemo} />
          {memos.length > 0 && (
            <List dense>
              {memos.map((m) => (
                <ListItem
                  key={m.laneText}
                  secondaryAction={
                    <IconButton edge="end" aria-label="削除" onClick={() => deleteMemo(m.laneText)} size="small">
                      <DeleteOutlineIcon />
                    </IconButton>
                  }
                  disableGutters
                >
                  <ListItemText primary={m.laneText} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Stack>
    </FloatingSheet>
  );
};
