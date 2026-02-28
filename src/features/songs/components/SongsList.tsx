import { List } from "@mui/material";
import type { Song } from "../../../schema/song";
import type { SongSummaryRow } from "../model/songSummaryRow";
import { SongSummaryRowItem } from "./SongSummaryRowItem";

type SongsListProps = {
  rows: SongSummaryRow[];
  onSelectChart?: (song: Song) => void;
};

export const SongsList: React.FC<SongsListProps> = ({ rows, onSelectChart }) => {
  return (
    <List
      disablePadding
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        overflow: "hidden",
        "& > li:not(:last-of-type)": {
          borderBottom: 1,
          borderColor: "divider",
        },
      }}
    >
      {rows.map((row) => (
        <SongSummaryRowItem key={row.songId} row={row} onSelectChart={onSelectChart} />
      ))}
    </List>
  );
};
