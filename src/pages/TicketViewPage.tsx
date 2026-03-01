import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import React, { useCallback, useDeferredValue, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router";

import { trackTextageClickFromTicketList } from "../analytics/events";
import { Page } from "../components/layout/Page";
import { Pager } from "../components/ui";
import { useAtariRulesQuery } from "../features/shared/data/useAtariRulesQuery";
import { AtariInfoSheet } from "../features/ticket/components/AtariInfoSheet";
import { AtariRuleCard } from "../features/ticket/components/AtariRuleCard";
import { GroupedTableView } from "../features/ticket/components/TicketDataTable/GroupedTableView";
import { TicketDataTable } from "../features/ticket/components/TicketDataTable";
import { TicketFilterPanel } from "../features/ticket/components/TicketFilterPanel";
import { TicketListModeSwitch } from "../features/ticket/components/TicketFilterPanel/TicketListModeSwitch";
import { useTicketFilter } from "../features/ticket/hooks/useTicketFilter";
import { type RecommendedSong, type SongDifficulty } from "../features/ticket/hooks/useTextageSongOptions";
import { groupTicketsByLaneText } from "../features/ticket/model/ticketGrouping";
import {
  type FilterMode,
  normalizeTicketSearchForm,
  searchFormSchema,
  type SearchFormValues,
} from "../features/ticket/model/search";
import { usePager } from "../hooks/usePager";
import type { Song } from "../schema/song";
import { useSettingsStore } from "../store/settingsStore";
import { useTicketsStore } from "../store/ticketsStore";
import type { PlaySide, Ticket } from "../types";
import { makeTextageUrl } from "../utils/makeTextageUrl";

const sampleTickets: Ticket[] = [
  { laneText: "1234567", expiration: "2999/12/31" },
  { laneText: "7654321", expiration: "2999/12/31" },
  { laneText: "3456712", expiration: "2999/12/31" },
  { laneText: "5432176", expiration: "2999/12/31" },
  { laneText: "1357246", expiration: "2999/12/31" },
  { laneText: "2461357", expiration: "2999/12/31" }, // 1P側
  { laneText: "6427531", expiration: "2999/12/31" },
  { laneText: "7531642", expiration: "2999/12/31" }, // 2P側
  { laneText: "1726354", expiration: "2999/12/31" },
  { laneText: "4567123", expiration: "2999/12/31" },
  { laneText: "1562347", expiration: "2999/12/31" }, // AIR RAID 1P
  { laneText: "1564237", expiration: "2999/12/31" }, // AIR RAID 2P
];

interface TicketViewPageProps {
  isSample?: boolean;
  pageTitle?: string;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false, pageTitle }) => {
  const { atariRules, isLoading: isAtariRulesLoading } = useAtariRulesQuery();

  const persistentTickets = useTicketsStore((s) => s.tickets);
  const tickets = isSample ? sampleTickets : persistentTickets;

  const playSide = useSettingsStore((s) => s.playSide);
  const isGroupedTicketListEnabled = useSettingsStore((s) => s.isGroupedTicketListEnabled);
  const deferredPlaySide = useDeferredValue(playSide);
  const updatePlaySide = useSettingsStore((s) => s.updatePlaySide);
  const updateGroupedTicketListEnabled = useSettingsStore((s) => s.updateGroupedTicketListEnabled);

  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: {
      scratchSideText: "",
      isScratchSideUnordered: true,
      nonScratchSideText: "",
      isNonScratchSideUnordered: true,
    },
  });

  const [filterMode, setFilterMode] = useState<FilterMode>("recommend");
  const [textageSong, setTextageSong] = useState<Song | null>(null);

  const recommendedSongs = useMemo<RecommendedSong[]>(() => {
    const allowedSet = new Set<SongDifficulty>(["sph", "spa", "spl"]);
    const seen = new Set<string>();
    return atariRules.reduce<RecommendedSong[]>((acc, rule) => {
      if (!allowedSet.has(rule.difficulty as SongDifficulty)) {
        return acc;
      }
      const difficulty = rule.difficulty as SongDifficulty;
      const key = `${rule.songId}-${difficulty}`;
      if (seen.has(key)) {
        return acc;
      }
      seen.add(key);
      acc.push({ songId: rule.songId, difficulty });
      return acc;
    }, []);
  }, [atariRules]);

  const formValues = useWatch<SearchFormValues>({ control: methods.control }) ?? methods.getValues();
  const normalizedQuery = useMemo(() => normalizeTicketSearchForm(formValues), [formValues]);

  const { filteredTickets, selectedAtariRules, atariMap } = useTicketFilter({
    tickets,
    searchQuery: normalizedQuery,
    filterMode,
    textageSong,
    playSide: deferredPlaySide,
    atariRules,
  });

  const groupedTickets = useMemo(() => groupTicketsByLaneText(filteredTickets), [filteredTickets]);
  const rawPager = usePager(filteredTickets);
  const groupedPager = usePager(groupedTickets);

  const coloredRawTickets = useMemo(
    () =>
      rawPager.paginated.map((ticket) => ({
        ...ticket,
        highlightColor: atariMap.getColorForTicket(ticket, playSide),
      })),
    [rawPager.paginated, atariMap, playSide]
  );

  const coloredGroupedRows = useMemo(
    () =>
      groupedPager.paginated.map((row) => ({
        ...row,
        highlightColor: atariMap.getColorForTicket({ laneText: row.laneText }, playSide),
      })),
    [groupedPager.paginated, atariMap, playSide]
  );

  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const detailTicketRules = useMemo(() => {
    if (!detailTicket) return [];
    return atariMap.getRulesForTicket(detailTicket, playSide) || [];
  }, [detailTicket, atariMap, playSide]);

  const handlePlaySideChange = (newPlaySide: PlaySide) => {
    updatePlaySide(newPlaySide);
  };

  const handleGroupedTicketListEnabledChange = (enabled: boolean) => {
    updateGroupedTicketListEnabled(enabled);
    rawPager.setPage(1);
    groupedPager.setPage(1);
  };

  const getTextageUrl = useCallback(
    (ticket: Ticket) => {
      if (!textageSong) return undefined;
      return makeTextageUrl(textageSong.url, playSide, ticket.laneText);
    },
    [textageSong, playSide]
  );

  const getGroupedTextageUrl = useCallback(
    (laneText: string) => {
      if (!textageSong) return undefined;
      return makeTextageUrl(textageSong.url, playSide, laneText);
    },
    [textageSong, playSide]
  );

  const handleTextageFollow = useCallback(
    (laneText: string) => {
      if (!textageSong) return;
      trackTextageClickFromTicketList({
        filterMode,
        songTitle: textageSong.title,
        difficulty: textageSong.difficulty,
        laneText,
        playSide,
      });
    },
    [textageSong, filterMode, playSide]
  );

  const handleFilterModeChange = (mode: FilterMode) => {
    setFilterMode(mode);
    setTextageSong(null);
    rawPager.setPage(1);
    groupedPager.setPage(1);
  };

  const handleSongSelect = (song: Song | null) => {
    setTextageSong(song);
    rawPager.setPage(1);
    groupedPager.setPage(1);
  };

  const isLoading = !isSample && isAtariRulesLoading;

  if (isLoading) {
    return (
      <Page title={pageTitle}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </Page>
    );
  }

  return (
    <Page title={pageTitle}>
      <FormProvider {...methods}>
        <Stack spacing={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <TicketFilterPanel
            playSide={playSide}
            onPlaySideChange={handlePlaySideChange}
            filterMode={filterMode}
            onFilterModeChange={handleFilterModeChange}
            selectedSong={textageSong}
            onSongSelect={handleSongSelect}
            recommendedSongs={recommendedSongs}
          />
          <AtariRuleCard rules={selectedAtariRules} playSide={playSide} />
          <Divider />
          {tickets.length === 0 && !isSample ? (
            <Stack spacing={2}>
              <Box>
                <Typography>チケットがまだありません。</Typography>
                <Typography>
                  チケットをインポートするか、<Link to="/sample">サンプル</Link>で機能を確認できます。
                </Typography>
                <Button component={Link} to="/import" variant="contained" sx={{ mt: 2 }}>
                  インポートページへ
                </Button>
              </Box>
            </Stack>
          ) : isGroupedTicketListEnabled ? (
            groupedPager.totalCount === 0 ? (
              <Typography>検索条件に一致するチケットはありません。</Typography>
            ) : (
              <Pager
                totalCount={groupedPager.totalCount}
                page={groupedPager.page}
                pageCount={groupedPager.pageCount}
                itemsPerPage={groupedPager.perPage}
                headerControls={
                  <TicketListModeSwitch
                    checked={isGroupedTicketListEnabled}
                    onChange={handleGroupedTicketListEnabledChange}
                  />
                }
                onPageChange={groupedPager.handlePageChange}
                onItemsPerPageChange={groupedPager.handlePerPageChange}
              >
                <GroupedTableView
                  rows={coloredGroupedRows}
                  selectedLaneText={detailTicket?.laneText}
                  onLaneTextSelect={(laneText) => setDetailTicket({ laneText })}
                  getTextageUrl={getGroupedTextageUrl}
                  onTextageFollow={handleTextageFollow}
                />
              </Pager>
            )
          ) : (
            <TicketDataTable
              tickets={coloredRawTickets}
              totalCount={rawPager.totalCount}
              currentPage={rawPager.page}
              pageCount={rawPager.pageCount}
              itemsPerPage={rawPager.perPage}
              pagerHeaderControls={
                <TicketListModeSwitch
                  checked={isGroupedTicketListEnabled}
                  onChange={handleGroupedTicketListEnabledChange}
                />
              }
              onPageChange={rawPager.handlePageChange}
              onItemsPerPageChange={rawPager.handlePerPageChange}
              onRowSelect={(ticket) => setDetailTicket(ticket)}
              selectedTicket={detailTicket}
              getTextageUrl={getTextageUrl}
              onTextageFollow={handleTextageFollow}
            />
          )}
        </Stack>
        {detailTicket && detailTicketRules.length > 0 && (
          <AtariInfoSheet ticket={detailTicket} rules={detailTicketRules} onClose={() => setDetailTicket(null)} />
        )}
      </FormProvider>
    </Page>
  );
};
