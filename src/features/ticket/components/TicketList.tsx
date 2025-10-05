import { List } from "@mui/material";
import React from "react";

import { HighlightColor, Ticket } from "../../../types";
import { TicketRow } from "./TicketRow";

interface TicketListProps {
  tickets: (Ticket & { highlightColor?: HighlightColor })[];
  onRowSelect?: (ticket: Ticket) => void;
  selectedTicket?: Ticket | null;
  getTextageUrl?: (ticket: Ticket) => string | undefined;
  onTextageFollow?: (laneText: string) => void;
}

const TicketListComponent: React.FC<TicketListProps> = ({
  tickets,
  onRowSelect,
  selectedTicket,
  getTextageUrl,
  onTextageFollow,
}) => {
  if (tickets.length === 0) {
    return null;
  }

  const handleRowSelect = (ticket: Ticket) => {
    onRowSelect?.(ticket);
  };

  return (
    <List
      disablePadding
      sx={{
        border: 1,
        borderColor: "divider",
        "& > li:not(:last-of-type)": {
          borderBottom: 1,
          borderColor: "divider",
        },
      }}
    >
      {tickets.map((ticket, index) => (
        <TicketRow
          key={`${ticket.laneText}-${index}`}
          ticket={ticket}
          selected={selectedTicket === ticket}
          onSelect={handleRowSelect}
          textageUrl={getTextageUrl?.(ticket)}
          onTextageFollow={onTextageFollow}
        />
      ))}
    </List>
  );
};

export const TicketList = React.memo(TicketListComponent);
