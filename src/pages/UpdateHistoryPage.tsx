import { Stack, Typography } from "@mui/material";

import { UpdateHistoryCard } from "../components/history/UpdateHistoryCard";
import { Page } from "../components/layout/Page";
import { updateHistory } from "../data/updateHistory";

export const UpdateHistoryPage: React.FC = () => {
  return (
    <Page title="更新履歴" description="主要なアップデートをまとめたページ">
      <Stack spacing={3} sx={{ px: 2, py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          更新履歴
        </Typography>
        <Stack spacing={2} component="section">
          {updateHistory.map((entry) => (
            <UpdateHistoryCard key={entry.id} entry={entry} />
          ))}
        </Stack>
      </Stack>
    </Page>
  );
};
