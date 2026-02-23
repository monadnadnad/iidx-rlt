import { ListItem, ListItemButton, Typography } from "@mui/material";

import { HighlightColor, Ticket } from "../../../../types";
import { AtariStatus } from "./AtariStatus";
import { TextageLink } from "./TextageLink";

type RowItemProps = {
  ticket: Ticket & { highlightColor?: HighlightColor };
  selected?: boolean;
  onSelect?: (ticket: Ticket) => void;
  textageUrl?: string;
  onTextageFollow?: (laneText: string) => void;
};

export const RowItem: React.FC<RowItemProps> = ({
  ticket,
  selected = false,
  onSelect,
  textageUrl,
  onTextageFollow,
}) => {
  const expirationLabel = `有効期限: ${ticket.expiration ?? "-"}`;

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        onClick={() => onSelect?.(ticket)}
        aria-selected={selected}
        sx={{
          display: "grid",
          gridTemplateColumns: "max-content minmax(0, 1fr) max-content",
          gridTemplateRows: "auto auto",
          columnGap: { xs: 1.25, sm: 2 },
          rowGap: 0.25,
          alignItems: "center",
          py: 1.5,
        }}
      >
        <AtariStatus
          color={ticket.highlightColor}
          sx={{
            gridRow: "1 / 3",
          }}
        />
        <Typography
          variant="body1"
          sx={{
            gridColumn: 2,
            gridRow: 1,
            minWidth: "7ch",
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
            fontSize: "1.1rem",
            lineHeight: 1.3,
          }}
          noWrap
        >
          {ticket.laneText}
        </Typography>
        <Typography
          component="span"
          sx={{
            gridColumn: "2 / -1",
            gridRow: 2,
            minWidth: 0,
            color: "text.secondary",
            fontSize: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {expirationLabel}
        </Typography>
        <TextageLink href={textageUrl} onFollow={() => onTextageFollow?.(ticket.laneText)} />
      </ListItemButton>
    </ListItem>
  );
};
