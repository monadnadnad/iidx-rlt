import { Box, Chip, CircularProgress, List, ListItem, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLiveQuery } from "dexie-react-hooks";
import React from "react";

import { Page } from "../components/layout/Page";
import { Pager } from "../components/ui";
import { appDb } from "../db/appDb";
import { usePager } from "../hooks/usePager";
import type { Song } from "../schema/song";

const targetDifficulties: Array<Song["difficulty"]> = ["sph", "spa", "spl"];

const difficultyLabel: Record<Song["difficulty"], string> = {
  spb: "SPB",
  spn: "SPN",
  sph: "SPH",
  spa: "SPA",
  spl: "SPL",
};

const formatDifficulty = (difficulty: Song["difficulty"], level: number) =>
  `${difficultyLabel[difficulty]} / ☆${level}`;

const sortCharts = (a: Song, b: Song) => {
  const titleA = a.titleNormalized ?? a.title;
  const titleB = b.titleNormalized ?? b.title;
  return (
    titleA.localeCompare(titleB, "ja") ||
    targetDifficulties.indexOf(a.difficulty) - targetDifficulties.indexOf(b.difficulty)
  );
};

export const ChartsPage: React.FC = () => {
  const theme = useTheme();
  const difficultyColor: Record<Song["difficulty"], string> = {
    spb: theme.palette.info.main,
    spn: theme.palette.info.main,
    sph: theme.palette.difficulty.hyper,
    spa: theme.palette.difficulty.another,
    spl: theme.palette.difficulty.leggendaria,
  };

  const charts = useLiveQuery(async () => {
    if (typeof window === "undefined") {
      return [] as Song[];
    }
    const entries = await appDb.songs.where("difficulty").anyOf(targetDifficulties).toArray();
    return entries.sort(sortCharts);
  }, []);

  const isLoading = charts === undefined;
  const {
    paginated: paginatedCharts,
    totalCount,
    page: currentPage,
    pageCount,
    perPage: itemsPerPage,
    handlePageChange,
    handlePerPageChange,
  } = usePager(charts ?? []);

  return (
    <Page title="楽曲一覧" description="譜面と当たり配置定義の一覧">
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <CircularProgress />
        </Box>
      ) : (
        <Pager
          totalCount={totalCount}
          page={currentPage}
          pageCount={pageCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePerPageChange}
          maxWidth={960}
        >
          <Box sx={{ px: 1.5 }}>
            <Box sx={{ overflowX: "auto" }}>
              <List
                disablePadding
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1.5,
                  overflow: "hidden",
                }}
              >
                {paginatedCharts.map((chart, idx) => (
                  <ListItem
                    key={chart.id}
                    sx={{
                      px: 1.5,
                      py: 1.1,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      borderBottom: idx === paginatedCharts.length - 1 ? "none" : 1,
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                        {chart.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        収録バージョン: {chart.version >= 0 ? `IIDX ${chart.version}` : "不明"}
                      </Typography>
                    </Box>
                    <Chip
                      label={formatDifficulty(chart.difficulty, chart.level)}
                      size="small"
                      variant="outlined"
                      sx={{
                        flexShrink: 0,
                        fontWeight: 600,
                        borderColor: difficultyColor[chart.difficulty],
                        color: difficultyColor[chart.difficulty],
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Pager>
      )}
    </Page>
  );
};
