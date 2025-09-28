import { Stack, Typography } from "@mui/material";

import { UpdateHistoryItem } from "../components/history/UpdateHistoryItem";
import { Page } from "../components/layout/Page";
import { updateHistory } from "../data/updateHistory";

export const UpdateHistoryPage: React.FC = () => {
  return (
    <Page title="更新履歴" description="主要なアップデートをまとめたページ">
      <Stack spacing={3} sx={{ px: 2, py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          更新履歴
        </Typography>
        <Typography variant="body1" color="text.secondary">
          主な更新内容をまとめています。
        </Typography>
        <Stack spacing={2} component="section">
          {updateHistory.map((entry) => (
            <UpdateHistoryItem key={entry.id} entry={entry} />
          ))}
        </Stack>
      </Stack>
    </Page>
  );
};
