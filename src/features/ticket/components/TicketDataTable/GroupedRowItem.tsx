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
          gridTemplateColumns: "max-content max-content minmax(0, 1fr) max-content",
          columnGap: 2,
          alignItems: "center",
        }}
      >
        <AtariStatus color={highlightColor} />
        <Typography
          variant="body1"
          sx={{
            minWidth: "7ch",
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
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
            minWidth: 0,
            color: "text.secondary",
            fontSize: "0.75rem",
            fontVariantNumeric: "tabular-nums",
            justifySelf: "end",
          }}
          noWrap
        >
          x {count}枚
        </Typography>
        <TextageLink href={textageUrl} onFollow={() => onTextageFollow?.(laneText)} />
      </ListItemButton>
    </ListItem>
  );
};
