import { Box } from "@mui/material";

import { HighlightColor } from "../../../../types";

type AtariStatusProps = {
  color?: HighlightColor;
};

export const AtariStatus: React.FC<AtariStatusProps> = ({ color }) => (
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
