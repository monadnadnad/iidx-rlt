import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
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
import { useChartMemo } from "../../memo/useChartMemo";

type ChartDetailSheetProps = {
  chart: Song;
  rules: AtariRule[];
  onClose: () => void;
};

type LaneTextFormProps = {
  onSubmit: (laneText: string) => Promise<void>;
};

const laneTextFormSchema = z.object({
  laneText: createLaneTextSchema(7, { allowWildcard: false, requireFullLength: true }),
});

const LaneTextForm: React.FC<LaneTextFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit, formState } = useForm<z.infer<typeof laneTextFormSchema>>({
    resolver: zodResolver(laneTextFormSchema),
    defaultValues: { laneText: "" },
  });

  const laneTextError = formState.errors.laneText?.message;

  const submit = handleSubmit(async ({ laneText }) => {
    await onSubmit(laneText);
  });

  return (
    <form onSubmit={submit} style={{ width: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
        <Controller
          name="laneText"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              size="small"
              disabled={formState.isSubmitting}
              placeholder="例: 1234576"
              error={!!laneTextError}
              helperText={fieldState.error?.message ?? "押しやすかった配置をメモ"}
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
        <Button
          type="submit"
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          disabled={formState.isSubmitting}
          sx={{ flexShrink: 0, alignSelf: "center", whiteSpace: "nowrap" }}
        >
          保存
        </Button>
      </Stack>
    </form>
  );
};

export const ChartDetailSheet: React.FC<ChartDetailSheetProps> = ({ chart, rules, onClose }) => {
  const { memos, saveMemo, deleteMemo } = useChartMemo({
    songId: chart.songId,
    difficulty: chart.difficulty,
  });
  const playSide = useSettingsStore((s) => s.playSide);

  const formatPattern = (pattern: SearchPattern, side: PlaySide) => {
    const scratch = `${pattern.scratchSideText}${pattern.isScratchSideUnordered ? " (順不同)" : ""}`;
    const nonscratch = `${pattern.nonScratchSideText}${pattern.isNonScratchSideUnordered ? " (順不同)" : ""}`;
    return side === "1P" ? `${scratch} | ${nonscratch}` : `${nonscratch} | ${scratch}`;
  };

  const sheetTitle = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Stack>
        <Typography variant="h6" component="span">
          {chart.title}
        </Typography>
        <Box component="span" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
          {chart.versionName} / {DIFFICULTY_LABEL[chart.difficulty]} ☆{chart.level}
        </Box>
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
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                当たり配置の定義
              </Typography>
              <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                {rules.flatMap((rule) =>
                  rule.patterns.map((pattern, idx) => {
                    const patternText = formatPattern(pattern, playSide);
                    return (
                      <ListItem key={`${rule.id}-${idx}`} disableGutters>
                        <ListItemText primary={patternText} secondary={rule.description ?? undefined} />
                      </ListItem>
                    );
                  })
                )}
              </List>
            </Box>
            <Divider />
          </>
        )}

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            配置メモ
          </Typography>
          <LaneTextForm key={chart.id} onSubmit={saveMemo} />
          {memos.length > 0 && (
            <List dense>
              {memos.map((m) => (
                <ListItem
                  key={m.laneText}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteMemo(m.laneText)} size="small">
                      <DeleteOutlineIcon fontSize="small" />
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
