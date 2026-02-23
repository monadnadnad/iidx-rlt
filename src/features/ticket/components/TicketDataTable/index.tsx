import { Typography } from "@mui/material";
import React from "react";

import { Pager } from "../../../../components/ui";
import { HighlightColor, Ticket } from "../../../../types";
import { TableView } from "./TableView";

type TicketDataTableProps = {
  tickets: (Ticket & { highlightColor?: HighlightColor })[];
  totalCount: number;
  currentPage: number;
  pageCount: number;
  itemsPerPage: number;
  pagerHeaderControls?: React.ReactNode;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onItemsPerPageChange: (event: React.MouseEvent<HTMLElement>, newItemsPerPage: number | null) => void;
  onRowSelect?: (ticket: Ticket) => void;
  selectedTicket?: Ticket | null;
  getTextageUrl?: (ticket: Ticket) => string | undefined;
  onTextageFollow?: (laneText: string) => void;
};

export const TicketDataTable: React.FC<TicketDataTableProps> = ({
  tickets,
  totalCount,
  currentPage,
  pageCount,
  itemsPerPage,
  pagerHeaderControls,
  onPageChange,
  onItemsPerPageChange,
  onRowSelect,
  selectedTicket,
  getTextageUrl,
  onTextageFollow,
}) => {
  if (totalCount === 0) {
    return <Typography>検索条件に一致するチケットはありません。</Typography>;
  }

  return (
    <Pager
      totalCount={totalCount}
      page={currentPage}
      pageCount={pageCount}
      itemsPerPage={itemsPerPage}
      headerControls={pagerHeaderControls}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
    >
      <TableView
        tickets={tickets}
        onRowSelect={onRowSelect}
        selectedTicket={selectedTicket}
        getTextageUrl={getTextageUrl}
        onTextageFollow={onTextageFollow}
      />
    </Pager>
  );
};
