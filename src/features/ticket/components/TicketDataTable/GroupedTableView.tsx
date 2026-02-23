import { List } from "@mui/material";
import React from "react";

import type { HighlightColor } from "../../../../types";
import { GroupedRowItem } from "./GroupedRowItem";

export type GroupedRow = {
  laneText: string;
  count: number;
  highlightColor?: HighlightColor;
};

type GroupedTableViewProps = {
  rows: GroupedRow[];
  selectedLaneText?: string | null;
  onLaneTextSelect?: (laneText: string) => void;
  getTextageUrl?: (laneText: string) => string | undefined;
  onTextageFollow?: (laneText: string) => void;
};

const GroupedTableViewComponent: React.FC<GroupedTableViewProps> = ({
  rows,
  selectedLaneText,
  onLaneTextSelect,
  getTextageUrl,
  onTextageFollow,
}) => {
  if (rows.length === 0) {
    return null;
  }

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
      {rows.map((row) => (
        <GroupedRowItem
          key={row.laneText}
          laneText={row.laneText}
          count={row.count}
          highlightColor={row.highlightColor}
          selected={!!selectedLaneText && row.laneText === selectedLaneText}
          onSelect={onLaneTextSelect}
          textageUrl={getTextageUrl?.(row.laneText)}
          onTextageFollow={onTextageFollow}
        />
      ))}
    </List>
  );
};

export const GroupedTableView = React.memo(GroupedTableViewComponent);
