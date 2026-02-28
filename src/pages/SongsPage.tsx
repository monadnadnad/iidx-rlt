import { Box, CircularProgress, Stack } from "@mui/material";
import React, { useMemo, useState } from "react";
import useSWR from "swr";

import { Page } from "../components/layout/Page";
import { Pager } from "../components/ui";
import { SongDetailSheet } from "../features/songs/components/SongDetailSheet";
import { SongsList } from "../features/songs/components/SongsList";
import { SongsSearchPanel } from "../features/songs/components/SongsSearchPanel";
import { useSongsQuery, type SongsSearchState } from "../features/songs/hooks/useSongsQuery";
import { usePager } from "../hooks/usePager";
import { createAtariMap } from "../utils/atari";
import { createInitialSongSearchState } from "../utils/songSearch";
import type { AtariRule } from "../types";
import type { Song } from "../schema/song";

export const SongsPage: React.FC = () => {
  const [searchState, setSearchState] = useState<SongsSearchState>(createInitialSongSearchState);
  const [selectedChart, setSelectedChart] = useState<Song | null>(null);
  const { data: atariRules, isLoading: isAtariRulesLoading } = useSWR<AtariRule[]>(
    `${import.meta.env.BASE_URL}data/atari-rules.json`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  const atariMap = useMemo(() => (atariRules ? createAtariMap(atariRules) : null), [atariRules]);

  const hasAtariRuleForSong = useMemo(() => {
    if (!atariMap) return undefined;
    return (song: Song) => {
      const rules = atariMap.getRulesForSong(song.songId, song.difficulty);
      return !!rules && rules.length > 0;
    };
  }, [atariMap]);

  const { summaryRows, isLoading } = useSongsQuery({ searchState, hasAtariRuleForSong });

  const selectedRules = useMemo(() => {
    if (!selectedChart || !atariMap) return [] as AtariRule[];
    return atariMap.getRulesForSong(selectedChart.songId, selectedChart.difficulty) ?? [];
  }, [selectedChart, atariMap]);

  const {
    paginated: paginatedRows,
    totalCount,
    page: currentPage,
    pageCount,
    perPage: itemsPerPage,
    setPage,
    handlePageChange,
    handlePerPageChange,
  } = usePager(summaryRows);

  const handleSearchChange = (nextState: SongsSearchState) => {
    setSearchState(nextState);
    setPage(1);
  };

  return (
    <Page title="楽曲一覧" description="譜面と当たり配置定義の一覧">
      <Stack spacing={2} sx={{ flexGrow: 1, alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 960 }}>
          <SongsSearchPanel
            value={searchState}
            onChange={handleSearchChange}
            disableAtariFilter={!atariMap || isAtariRulesLoading}
          />
        </Box>

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
            <SongsList rows={paginatedRows} onSelectChart={setSelectedChart} />
          </Pager>
        )}

        {selectedChart && (
          <SongDetailSheet song={selectedChart} rules={selectedRules} onClose={() => setSelectedChart(null)} />
        )}
      </Stack>
    </Page>
  );
};
