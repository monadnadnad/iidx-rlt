import XIcon from "@mui/icons-material/X";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";

interface XLinkProps {
  variant?: "icon" | "listitem";
}

export const XLink: React.FC<XLinkProps> = ({ variant = "icon" }) => {
  if (variant === "listitem") {
    return (
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://twitter.com/kurupi_sfw/status/1946146384685760611"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon>
            <XIcon />
          </ListItemIcon>
          <ListItemText primary="@kurupi_sfw"></ListItemText>
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <IconButton
      component="a"
      href="https://twitter.com/kurupi_sfw/status/1946146384685760611"
      target="_blank"
      rel="noopener noreferrer"
    >
      <XIcon />
    </IconButton>
  );
};
