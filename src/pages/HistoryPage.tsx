import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { Page } from "../components/layout/Page";
import { appDb } from "../db/appDb";
import { SONGS_VERSION_META_KEY } from "../features/songs/syncSongs";

export interface UpdateHistoryEntry {
  id: string;
  releasedAt: string;
  title: string;
  summary: string;
  details?: string[];
}

export const updateHistory = [
  {
    id: "song-filter-update",
    releasedAt: "2025-11-16",
    title: "曲選択欄の調整",
    summary: "検索フィルタの追加と、曲タイトルによる検索の精度を改善しました。",
    details: ["Lvと難易度を条件として追加", "更新履歴に曲データ取得日時の表示を追加"],
  },
  {
    id: "site-migration",
    releasedAt: "2025-09-27",
    title: "サイト移転しました",
    summary: "GitHubリポジトリの移動に伴いURLが変わりました。",
    details: [
      "ブックマークレットの更新が必要なことなど、既存ユーザー向けの注意点を各ページに記載しました",
      "旧URLはしばらくの間、既存ユーザーのService Workerの解除と本URLへのリダイレクトを配置しています",
    ],
  },
  {
    id: "manual-import",
    releasedAt: "2025-08-25",
    title: "チケットを手動登録できるようにしました",
    summary: "ブックマークレットが意外と障壁とわかったので、手動でチケットを登録できるようにしました。",
    details: ["無料チケットで数枚だけ持っている人向け", "ブックマークレットが面倒で障壁に感じる人向け"],
  },
  {
    id: "recommend-improvements",
    releasedAt: "2025-08-12",
    title: "曲からチケットを絞り込む機能を追加",
    summary: "当たり配置を定義してある曲からチケットを絞り込めるようにしました。",
    details: ["「おすすめから検索」で曲を選ぶとチケットが絞りこまれます"],
  },
  {
    id: "pagination",
    releasedAt: "2025-08-12",
    title: "チケット一覧にページ分割を追加",
    summary: "千枚単位でチケットをインポートするととても重かったので、ページネーションを追加しました。",
  },
  {
    id: "first-release",
    releasedAt: "2025-07-18",
    title: "一般公開",
    summary: "知識がなくてもランダムレーンチケットの活用先を見つけられるようなツールとして公開しました。",
  },
] satisfies ReadonlyArray<UpdateHistoryEntry>;

interface UpdateHistoryCardProps {
  entry: UpdateHistoryEntry;
}

export const UpdateHistoryCard: React.FC<UpdateHistoryCardProps> = ({ entry }) => {
  const releaseDate = dayjs(entry.releasedAt);
  const releaseLabel = releaseDate.isValid() ? releaseDate.format("YYYY/MM/DD") : entry.releasedAt;

  return (
    <Card component="article" variant="outlined">
      <CardHeader
        title={entry.title}
        subheader={
          <>
            <ScheduleIcon fontSize="inherit" />
            {releaseLabel}
          </>
        }
        slotProps={{
          title: { component: "h2", variant: "h6" },
          subheader: {
            component: "time",
            variant: "body2",
            dateTime: entry.releasedAt,
            sx: { display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" },
          },
        }}
        sx={{ pb: 1.5, px: 2, pt: 2 }}
      />
      <Divider sx={{ mx: 2 }} />
      <CardContent sx={{ pt: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="body1">{entry.summary}</Typography>
          {entry.details && (
            <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
              {entry.details.map((item) => (
                <Box key={item} component="li" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" component="span">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const HistoryPage: React.FC = () => {
  const songsVersionMeta = useLiveQuery(async () => {
    if (typeof window === "undefined") {
      return null;
    }

    return appDb.meta.get(SONGS_VERSION_META_KEY);
  }, []);
  const songsFetchedLabel =
    songsVersionMeta?.value && dayjs(songsVersionMeta.value).isValid()
      ? dayjs(songsVersionMeta.value).format("YYYY/MM/DD HH:mm")
      : "";

  return (
    <Page title="更新履歴" description="主要なアップデートをまとめたページ">
      <Stack spacing={3} sx={{ px: 2, py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          更新履歴
        </Typography>
        {songsFetchedLabel && (
          <Typography variant="body2" color="text.secondary">
            曲データ取得日時: {songsFetchedLabel}
          </Typography>
        )}
        <Stack spacing={2} component="section">
          {updateHistory.map((entry) => (
            <UpdateHistoryCard key={entry.id} entry={entry} />
          ))}
        </Stack>
      </Stack>
    </Page>
  );
};
