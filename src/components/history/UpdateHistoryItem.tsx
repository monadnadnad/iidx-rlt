import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

import type { UpdateHistoryEntry } from "../../data/updateHistory";
import { Panel } from "../ui/Panel";

interface UpdateHistoryItemProps {
  entry: UpdateHistoryEntry;
}

export const UpdateHistoryItem: React.FC<UpdateHistoryItemProps> = ({ entry }) => {
  const releaseDate = dayjs(entry.releasedAt);
  const releaseLabel = releaseDate.isValid() ? releaseDate.format("YYYY/MM/DD") : entry.releasedAt;

  return (
    <Paper component="article" variant="outlined" sx={{ p: 0, borderRadius: 2, bgcolor: "background.paper" }}>
      <Panel
        title={
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
              {entry.title}
            </Typography>
            <ScheduleIcon fontSize="small" />
            <Typography variant="body2" component="time" dateTime={entry.releasedAt}>
              {releaseLabel}
            </Typography>
          </Box>
        }
      >
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
      </Panel>
    </Paper>
  );
};
