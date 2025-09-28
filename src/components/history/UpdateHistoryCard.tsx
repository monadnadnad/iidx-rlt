import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

import type { UpdateHistoryEntry } from "../../data/updateHistory";

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
