import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import React, { useCallback, useDeferredValue, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router";
import useSWR from "swr";

import { Page } from "../components/layout/Page";
import { PlaySideToggle } from "../components/ui/PlaySideToggle";
import { AtariInfoSheet } from "../features/ticket/components/AtariInfoSheet";
import { AtariRuleCard } from "../features/ticket/components/AtariRuleCard";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { TicketResultsSection } from "../features/ticket/components/TicketResultsSection";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { useTicketQuery } from "../features/ticket/hooks/useTicketQuery";
import { useTicketSelectors } from "../features/ticket/hooks/useTicketSelectors";
import { useSettingsStore } from "../store/settingsStore";
import { useTicketsStore } from "../store/ticketsStore";
import { AtariRule, PlaySide, SongInfo, Ticket } from "../types";
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { data: songs, isLoading: isSongDataLoading } = useSWR<SongInfo[]>(
    `${import.meta.env.BASE_URL}data/songs.json`,
    fetcher
  );
  const { data: atariRules, isLoading: isAtariRulesLoading } = useSWR<AtariRule[]>(
    `${import.meta.env.BASE_URL}data/atari-rules.json`,
    fetcher
  );

  const persistentTickets = useTicketsStore((s) => s.tickets);
  const tickets = isSample ? sampleTickets : persistentTickets;

  const playSide = useSettingsStore((s) => s.playSide);
  const deferredPlaySide = useDeferredValue(playSide);
  const updatePlaySide = useSettingsStore((s) => s.updatePlaySide);

  const { query, methods, ...handlers } = useTicketQuery();

  const { atariMap, atariSongs, selectedAtariRules, paginatedTickets, pageCount, totalCount } = useTicketSelectors(
    tickets,
    songs ?? [],
    atariRules ?? [],
    query,
    deferredPlaySide
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
      if (!query.textageSong) return undefined;
      return makeTextageUrl(query.textageSong.url, playSide, ticket.laneText);
    },
    [query.textageSong, playSide]
  );

  const handleTextageFollow = useCallback(
    (laneText: string) => {
      if (!query.textageSong) return;
      const eventName = query.filterMode === "recommend" ? "click_textage_link_recommend" : "click_textage_link_all";
      ReactGA.event(eventName, {
        song_title: query.textageSong.title,
        difficulty: query.textageSong.difficulty,
        lane_text: laneText,
        play_side: playSide,
      });
    },
    [query.textageSong, query.filterMode, playSide]
  );

  const isLoading = !isSample && (isSongDataLoading || isAtariRulesLoading);

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
          <PlaySideToggle value={playSide} onChange={handlePlaySideChange} />
          <TicketSearchForm />
          <Divider />
          <TextageForm
            allSongs={songs ?? []}
            atariSongs={atariSongs}
            selectedSong={query.textageSong}
            onSongSelect={handlers.handleTextageSongChange}
            searchMode={query.filterMode}
            onModeChange={handlers.handleFilterModeChange}
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
            <TicketResultsSection
              totalCount={totalCount}
              currentPage={query.currentPage}
              pageCount={pageCount}
              itemsPerPage={query.itemsPerPage}
              onPageChange={(_, page) => handlers.handlePageChange(page)}
              onItemsPerPageChange={(_, perPage) => handlers.handleItemsPerPageChange(perPage)}
            >
              <TicketList
                tickets={paginatedTickets}
                onRowSelect={(ticket) => setDetailTicket(ticket)}
                selectedTicket={detailTicket}
                getTextageUrl={getTextageUrl}
                onTextageFollow={handleTextageFollow}
              />
            </TicketResultsSection>
          )}
        </Stack>
        {detailTicket && detailTicketRules.length > 0 && (
          <AtariInfoSheet ticket={detailTicket} rules={detailTicketRules} onClose={() => setDetailTicket(null)} />
        )}
      </FormProvider>
    </Page>
  );
};
