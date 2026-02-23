import { ListItem, ListItemButton, Typography } from "@mui/material";

import { HighlightColor } from "../../../../types";
import { AtariStatus } from "./AtariStatus";
import { TextageLink } from "./TextageLink";

type GroupedRowItemProps = {
  laneText: string;
  count: number;
  highlightColor?: HighlightColor;
  selected?: boolean;
  onSelect?: (laneText: string) => void;
  textageUrl?: string;
  onTextageFollow?: (laneText: string) => void;
};

export const GroupedRowItem: React.FC<GroupedRowItemProps> = ({
  laneText,
  count,
  highlightColor,
  selected = false,
  onSelect,
  textageUrl,
  onTextageFollow,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        onClick={() => onSelect?.(laneText)}
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
          color={highlightColor}
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
          {laneText}
        </Typography>
        <Typography
          component="span"
          data-testid="grouped-ticket-count"
          data-count={count}
          sx={{
            gridColumn: "2 / -1",
            gridRow: 2,
            minWidth: 0,
            color: "text.secondary",
            fontSize: "0.75rem",
            fontVariantNumeric: "tabular-nums",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          noWrap
        >
          件数: {count}枚
        </Typography>
        <TextageLink href={textageUrl} onFollow={() => onTextageFollow?.(laneText)} />
      </ListItemButton>
    </ListItem>
  );
};
