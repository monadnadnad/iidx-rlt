import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import ListAltIcon from "@mui/icons-material/ListAlt";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { useSnackbarStore } from "../../store/snackbarStore";
import { AppSnackbar, ReloadPrompt } from "../ui";
import { AppBottomNavigation } from "./AppBottomNavigation";
import { AppDrawer } from "./AppDrawer";
import { AppHeader } from "./AppHeader";
import { AppNavItem } from "./types";

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
  const { open, message, severity, close: closeSnackbar } = useSnackbarStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
      }}
    >
      {!isMobile && <AppDrawer navItems={navItems} tabIndex={tabIndex} />}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <AppHeader />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            pb: isMobile ? `calc(${theme.spacing(9)} + env(safe-area-inset-bottom, 0px))` : 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      {isMobile && <AppBottomNavigation navItems={navItems} tabIndex={tabIndex} />}
      <AppSnackbar open={open} onClose={closeSnackbar} message={message} severity={severity} />
      {!import.meta.env.SSR && <ReloadPrompt />}
    </Box>
  );
};
