import React from "react";
import { ListItem, ListItemButton, ListItemIcon, IconButton, ListItemText } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

interface GitHubLinkProps {
  variant?: "icon" | "listitem";
}

export const GitHubLink: React.FC<GitHubLinkProps> = ({ variant = "icon" }) => {
  if (variant === "listitem") {
    return (
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://github.com/monadnadnad/iidx-rlt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary="GitHub"></ListItemText>
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <IconButton
      component="a"
      href="https://github.com/monadnadnad/iidx-rlt"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
    >
      <GitHubIcon />
    </IconButton>
  );
};
