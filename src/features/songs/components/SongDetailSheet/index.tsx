import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import ShareIcon from "@mui/icons-material/Share";
import { Box, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";

import { FloatingSheet } from "../../../../components/ui/FloatingSheet";
import type { Song } from "../../../../schema/song";
import { useSettingsStore } from "../../../../store/settingsStore";
import { useTicketsStore } from "../../../../store/ticketsStore";
import type { AtariRule } from "../../../../types";
import { makeTextageUrl } from "../../../../utils/makeTextageUrl";
import { DIFFICULTY_LABEL } from "../../../../utils/songSearch";
import { useSongMemo } from "../../../memo/useSongMemo";

import { LaneTextForm } from "./LaneTextForm";
import { RuleList } from "./RuleList";

type SongDetailSheetProps = {
  song: Song;
  rules: AtariRule[];
  onClose?: () => void;
};

export const SongDetailSheet: React.FC<SongDetailSheetProps> = ({ song, rules, onClose }) => {
  const { memos, saveMemo, deleteMemo } = useSongMemo({ songId: song.songId, difficulty: song.difficulty });
  const playSide = useSettingsStore((s) => s.playSide);
  const tickets = useTicketsStore((s) => s.tickets);

  const ticketCounts = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach((ticket) => {
      map.set(ticket.laneText, (map.get(ticket.laneText) ?? 0) + 1);
    });
    return map;
  }, [tickets]);

  const makePreviewUrl = useCallback(
    (laneText: string) => makeTextageUrl(song.url, playSide, laneText),
    [song.url, playSide]
  );

  const makeTweetUrl = useCallback(
    (laneText: string) => {
      const previewUrl = makePreviewUrl(laneText);
      const difficulty = DIFFICULTY_LABEL[song.difficulty];
      const tweetText = `【${song.title} ${difficulty}】${laneText}\n${previewUrl}\n#配置メモ`;
      return `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    },
    [makePreviewUrl, song.title, song.difficulty]
  );

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
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            メモ
          </Typography>
          {memos.length > 0 && (
            <List dense>
              {memos.map((memo) => {
                const ticketCount = ticketCounts.get(memo.laneText) ?? 0;

                return (
                  <ListItem
                    key={memo.laneText}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton
                          edge="end"
                          aria-label="Textageで開く"
                          size="small"
                          component="a"
                          href={makePreviewUrl(memo.laneText)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="X(Twitter)に投稿"
                          size="small"
                          component="a"
                          href={makeTweetUrl(memo.laneText)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                        <IconButton edge="end" aria-label="削除" onClick={() => deleteMemo(memo.laneText)} size="small">
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Stack>
                    }
                    disableGutters
                  >
                    <ListItemText
                      primary={memo.laneText}
                      secondary={
                        <Box
                          component="span"
                          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}
                        >
                          <LocalActivityOutlinedIcon fontSize="small" color={ticketCount > 0 ? "info" : "disabled"} />
                          <Typography component="span" variant="body2">
                            {ticketCount > 0 ? `該当チケット ${ticketCount}枚` : "該当チケットなし"}
                          </Typography>
                        </Box>
                      }
                      slotProps={{ secondary: { component: "span" } }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          <LaneTextForm key={song.id} onSubmit={saveMemo} />
          <RuleList rules={rules} playSide={playSide} />
        </Box>
      </Stack>
    </FloatingSheet>
  );
};
