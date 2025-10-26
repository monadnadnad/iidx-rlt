import { Box, ListItem, ListItemButton, Typography } from "@mui/material";

import { HighlightColor, Ticket } from "../../../types";
import { TextageLink } from "./TextageLink";

type TicketRowProps = {
  ticket: Ticket & { highlightColor?: HighlightColor };
  selected?: boolean;
  onSelect?: (ticket: Ticket) => void;
  textageUrl?: string;
  onTextageFollow?: (laneText: string) => void;
};

export const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  selected = false,
  onSelect,
  textageUrl,
  onTextageFollow,
}) => {
  const expiration = ticket.expiration ?? "";

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        onClick={() => onSelect?.(ticket)}
        aria-selected={selected}
        alignItems="center"
        sx={{ gap: 2 }}
      >
        <HighlightAccent color={ticket.highlightColor} />
        <Typography variant="body1" noWrap>
          {ticket.laneText}
        </Typography>
        <Typography
          component="span"
          sx={{
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
          noWrap
          hidden={!expiration}
        >
          {expiration && `有効期限: ${expiration}`}
        </Typography>
        <TextageLink href={textageUrl} onFollow={() => onTextageFollow?.(ticket.laneText)} />
      </ListItemButton>
    </ListItem>
  );
};

const HighlightAccent: React.FC<{ color?: HighlightColor }> = ({ color }) => (
  <Box
    component="span"
    sx={{
      width: 6,
      height: 28,
      borderRadius: 3,
      backgroundColor: color ? `highlight.${color}` : "transparent",
      flexShrink: 0,
    }}
  />
);
