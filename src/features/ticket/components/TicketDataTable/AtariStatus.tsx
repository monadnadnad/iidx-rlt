import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import { HighlightColor } from "../../../../types";

type AtariStatusProps = {
  color?: HighlightColor;
  sx?: SxProps<Theme>;
};

export const AtariStatus: React.FC<AtariStatusProps> = ({ color, sx }) => (
  <Box
    component="span"
    sx={{
      width: 6,
      minHeight: 28,
      borderRadius: 3,
      backgroundColor: color ? `highlight.${color}` : "transparent",
      flexShrink: 0,
      alignSelf: "stretch",
      ...sx,
    }}
  />
);
