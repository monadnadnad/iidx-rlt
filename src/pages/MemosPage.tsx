import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from "@mui/material";
import ReactGA from "react-ga4";

import { Page } from "../components/layout/Page";
import { appDb } from "../db/appDb";
import { useMemos, type MemoWithSong } from "../features/memo/useMemos";
import { useSettingsStore } from "../store/settingsStore";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { DIFFICULTY_LABEL } from "../utils/songSearch";

export const MemosPage: React.FC = () => {
  const memos = useMemos();
  const playSide = useSettingsStore((s) => s.playSide);

  const handleTextageClick = (memo: MemoWithSong) => {
    ReactGA.event("click_textage_link_from_memos_page", {
      song_id: memo.songId,
      song_title: memo.song?.title,
      difficulty: memo.difficulty,
      lane_text: memo.laneText,
    });
  };

  const deleteMemo = async (laneText: string, songId: string, difficulty: "spb" | "spn" | "sph" | "spa" | "spl") =>
    appDb.memos.delete([songId, difficulty, laneText]);

  return (
    <Page title="配置メモ">
      <Stack spacing={2}>
        {memos.length === 0 ? (
          <Typography>まだメモがありません。現状譜面一覧からのみ追加できます。</Typography>
        ) : (
          memos.map((m) => (
            <Card key={`${m.songId}-${m.difficulty}-${m.laneText}`} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="h6">{m.song?.title ?? m.songId}</Typography>
                  <Typography color="text.secondary">{DIFFICULTY_LABEL[m.difficulty]}</Typography>
                  <Typography color="text.secondary">{m.song?.level ? `☆${m.song.level}` : ""}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" mt={1} flexWrap="wrap">
                  <Typography variant="body1" fontWeight="bold">
                    {m.laneText}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {m.song?.url && (
                    <Button
                      size="small"
                      component="a"
                      href={makeTextageUrl(m.song.url, playSide, m.laneText)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleTextageClick(m)}
                      startIcon={<LaunchIcon />}
                    >
                      Textage
                    </Button>
                  )}
                </Stack>
                <IconButton
                  aria-label="削除"
                  onClick={() => deleteMemo(m.laneText, m.songId, m.difficulty)}
                  size="small"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))
        )}
      </Stack>
      <Typography color="text.secondary" mt={2} fontSize="0.9rem">
        曲に特定の配置をメモして、Xに共有したり、該当チケットを所持してるかなど確認できる機能を実験的に入れてみました。
        目的は「ユーザーの知見を借りたい」、「ユーザーが知見を共有することに興味がありそうか確認したい」などです。
        自分で当たり配置のルールを定義することに限界を感じたため、試しに作ってみた程度で、ほとんど機能はないです。
        こうしたほうがいいとかあったら右上のフィードバックから教えてください。
      </Typography>
    </Page>
  );
};
