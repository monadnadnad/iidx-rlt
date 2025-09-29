import React from "react";
import { IconButton, ListItem, ListItemIcon, Link as MuiLink } from "@mui/material";
import XIcon from "@mui/icons-material/X";

interface XLinkProps {
  variant?: "icon" | "listitem";
}

export const XLink: React.FC<XLinkProps> = ({ variant = "icon" }) => {
  if (variant === "listitem") {
    return (
      <ListItem>
        <ListItemIcon sx={{ minWidth: 0, mr: 1.5, display: "flex", alignItems: "center" }}>
          <XIcon fontSize="medium" />
        </ListItemIcon>
        <MuiLink
          href="https://twitter.com/kurupi_sfw/status/1946146384685760611"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          color="inherit"
          underline="hover"
        >
          作成者 @kurupi_sfw
        </MuiLink>
      </ListItem>
    );
  }

  return (
    <IconButton
      component="a"
      href="https://twitter.com/kurupi_sfw"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="X (Twitter)"
    >
      <XIcon />
    </IconButton>
  );
};
