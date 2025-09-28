import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InfoIcon from "@mui/icons-material/Info";
import HistoryIcon from "@mui/icons-material/History";
import React from "react";

import { AppHeader } from "./AppHeader";
import { AppDrawer } from "./AppDrawer";
import { AppBottomNavigation } from "./AppBottomNavigation";
import { AppNavItem } from "../../types";
import { AppSnackbar } from "../ui/AppSnackbar";
import { useSnackbar } from "../../contexts/SnackbarContext";

const navItems: AppNavItem[] = [
  { path: "/import", label: "インポート", icon: <VerticalAlignBottomIcon /> },
  { path: "/tickets", label: "チケット一覧", icon: <ListAltIcon /> },
  { path: "/updates", label: "更新履歴", icon: <HistoryIcon /> },
  { path: "/about", label: "About", icon: <InfoIcon /> },
];

export const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "/tickets" : location.pathname;
  const tabIndex = navItems.findIndex((item) => item.path === currentPath);
  const { open, message, severity, closeSnackbar } = useSnackbar();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {!isMobile && <AppDrawer navItems={navItems} tabIndex={tabIndex} />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppHeader />
        <Container sx={{ flexGrow: 1, p: 2, pb: isMobile ? 9 : 2 }}>
          <Outlet />
        </Container>
      </Box>
      {isMobile && <AppBottomNavigation navItems={navItems} tabIndex={tabIndex} />}
      <AppSnackbar open={open} onClose={closeSnackbar} message={message} severity={severity} />
    </Box>
  );
};
