import LaunchIcon from "@mui/icons-material/Launch";
import { Box, ListItem, ListItemButton, Link, Typography } from "@mui/material";

import { HighlightColor, Ticket } from "../../../types";

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
        {expiration && (
          <Typography
            component="span"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
            noWrap
          >
            {expiration} まで
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {textageUrl && (
          <Link
            href={textageUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            variant="body2"
            onClick={(event) => {
              event.stopPropagation();
              onTextageFollow?.(ticket.laneText);
            }}
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            <LaunchIcon fontSize="inherit" />
            <Typography component="span" variant="inherit">
              Textageで確認
            </Typography>
          </Link>
        )}
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
    aria-hidden="true"
  />
);
