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
  const expiration = ticket.expiration ?? "";

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        onClick={() => onSelect?.(ticket)}
        aria-selected={selected}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "max-content minmax(0, 1fr) max-content",
            sm: "max-content max-content minmax(0, 1fr) max-content",
          },
          columnGap: { xs: 1.25, sm: 2 },
          rowGap: { xs: 0.25, sm: 0 },
          alignItems: "center",
        }}
      >
        <AtariStatus color={ticket.highlightColor} />
        <Typography
          variant="body1"
          sx={{
            gridColumn: 2,
            minWidth: "7ch",
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
          }}
          noWrap
        >
          {ticket.laneText}
        </Typography>
        {expiration && (
          <Typography
            component="span"
            sx={{
              gridColumn: { xs: "2 / 4", sm: 3 },
              gridRow: { xs: 2, sm: 1 },
              minWidth: 0,
              color: "text.secondary",
              fontSize: "0.75rem",
              overflow: { xs: "visible", sm: "hidden" },
              textOverflow: { xs: "clip", sm: "ellipsis" },
              whiteSpace: { xs: "normal", sm: "nowrap" },
            }}
          >
            {`有効期限: ${expiration}`}
          </Typography>
        )}
        <TextageLink href={textageUrl} onFollow={() => onTextageFollow?.(ticket.laneText)} />
      </ListItemButton>
    </ListItem>
  );
};
