import React from "react";
import { IconButton, ListItem, ListItemIcon, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

interface GitHubLinkProps {
  variant?: "icon" | "listitem";
}

export const GitHubLink: React.FC<GitHubLinkProps> = ({ variant = "icon" }) => {
  if (variant === "listitem") {
    return (
      <ListItem>
        <ListItemIcon sx={{ minWidth: 0, mr: 1.5, display: "flex", alignItems: "center" }}>
          <GitHubIcon fontSize="medium" />
        </ListItemIcon>
        <Link
          href="https://github.com/monadnadnad/iidx-rlt"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          color="inherit"
          underline="hover"
        >
          GitHub
        </Link>
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
