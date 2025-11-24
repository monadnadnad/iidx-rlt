import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import React, { useCallback, useDeferredValue, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router";
import useSWR from "swr";

import { Page } from "../components/layout/Page";
import { AtariInfoSheet, AtariRuleCard, TicketDataTable, TicketFilterPanel } from "../features/ticket/components";
import { useTicketFilter } from "../features/ticket/hooks";
import { type RecommendedChart, type SongDifficulty } from "../features/ticket/hooks/useTextageSongOptions";
import { FilterMode, SearchFormValues, searchFormSchema } from "../features/ticket/types";
import { usePager } from "../hooks/usePager";
import type { Song } from "../schema/song";
import { useSettingsStore } from "../store/settingsStore";
import { useTicketsStore } from "../store/ticketsStore";
import { AtariRule, PlaySide, Ticket } from "../types";
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
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { data: atariRules, isLoading: isAtariRulesLoading } = useSWR<AtariRule[]>(
    `${import.meta.env.BASE_URL}data/atari-rules.json`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  const persistentTickets = useTicketsStore((s) => s.tickets);
  const tickets = isSample ? sampleTickets : persistentTickets;

  const playSide = useSettingsStore((s) => s.playSide);
  const deferredPlaySide = useDeferredValue(playSide);
  const updatePlaySide = useSettingsStore((s) => s.updatePlaySide);

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

  const recommendedCharts = useMemo<RecommendedChart[]>(() => {
    if (!atariRules) return [];
    const allowedSet = new Set<SongDifficulty>(["sph", "spa", "spl"]);
    const seen = new Set<string>();
    return atariRules.reduce<RecommendedChart[]>((acc, rule) => {
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
  const normalizedPattern = useMemo(() => {
    const {
      scratchSideText = "",
      isScratchSideUnordered = true,
      nonScratchSideText = "",
      isNonScratchSideUnordered = true,
    } = formValues || {};

    return {
      scratchSideText: scratchSideText.padEnd(3, "*"),
      isScratchSideUnordered,
      nonScratchSideText: nonScratchSideText.padEnd(4, "*"),
      isNonScratchSideUnordered,
    };
  }, [formValues]);

  const { filteredTickets, selectedAtariRules, atariMap } = useTicketFilter({
    tickets,
    pattern: { ...normalizedPattern, filterMode, textageSong },
    playSide: deferredPlaySide,
    atariRules: atariRules ?? [],
  });

  const pager = usePager(filteredTickets);
  const {
    paginated,
    page: currentPage,
    pageCount,
    totalCount,
    perPage: itemsPerPage,
    handlePerPageChange,
    handlePageChange,
  } = pager;

  const coloredTickets = useMemo(
    () =>
      paginated.map((ticket) => ({
        ...ticket,
        highlightColor: atariMap.getColorForTicket(ticket, playSide),
      })),
    [paginated, atariMap, playSide]
  );

  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const detailTicketRules = useMemo(() => {
    if (!detailTicket) return [];
    return atariMap.getRulesForTicket(detailTicket, playSide) || [];
  }, [detailTicket, atariMap, playSide]);

  const handlePlaySideChange = (newPlaySide: PlaySide) => {
    updatePlaySide(newPlaySide);
  };

  const getTextageUrl = useCallback(
    (ticket: Ticket) => {
      if (!textageSong) return undefined;
      return makeTextageUrl(textageSong.url, playSide, ticket.laneText);
    },
    [textageSong, playSide]
  );

  const handleTextageFollow = useCallback(
    (laneText: string) => {
      if (!textageSong) return;
      const eventName = filterMode === "recommend" ? "click_textage_link_recommend" : "click_textage_link_all";
      ReactGA.event(eventName, {
        song_title: textageSong.title,
        difficulty: textageSong.difficulty,
        lane_text: laneText,
        play_side: playSide,
      });
    },
    [textageSong, filterMode, playSide]
  );

  const handleFilterModeChange = (mode: FilterMode) => {
    setFilterMode(mode);
    setTextageSong(null);
    handlePageChange(null, 1);
  };

  const handleSongSelect = (song: Song | null) => {
    setTextageSong(song);
    handlePageChange(null, 1);
  };

  const isLoading = !isSample && isAtariRulesLoading;

  if (isLoading && !import.meta.env.SSR) {
    return (
      <Page title="チケット一覧・当たり支援 - RLT Manager">
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </Page>
    );
  }

  return (
    <Page title="チケット一覧・当たり配置候補">
      <FormProvider {...methods}>
        <Stack spacing={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <TicketFilterPanel
            playSide={playSide}
            onPlaySideChange={handlePlaySideChange}
            filterMode={filterMode}
            onFilterModeChange={handleFilterModeChange}
            selectedSong={textageSong}
            onSongSelect={handleSongSelect}
            recommendedCharts={recommendedCharts}
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
          ) : (
            <TicketDataTable
              tickets={coloredTickets}
              totalCount={totalCount}
              currentPage={currentPage}
              pageCount={pageCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handlePerPageChange}
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
