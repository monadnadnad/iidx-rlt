import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { GitHubLink } from "../../components/links/GitHubLink";
import { XLink } from "../../components/links/XLink";
import { AppNavItem } from "../../types";

interface AppDrawerProps {
  navItems: AppNavItem[];
  tabIndex: number;
  width?: number;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ navItems, tabIndex, width = 200 }) => {
  return (
    <Drawer
      component="nav"
      variant="permanent"
      sx={{ width, flexShrink: 0, [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" } }}
    >
      <List>
        {navItems.map((item, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton selected={tabIndex === i} component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ marginTop: "auto" }}>
        <Divider />
        <List>
          <GitHubLink variant="listitem" />
          <XLink variant="listitem" />
        </List>
      </Box>
    </Drawer>
  );
};
