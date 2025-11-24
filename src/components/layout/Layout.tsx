import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { Box, Container, ListItemIcon, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router";

import { useSnackbarStore } from "../../store/snackbarStore";
import { AppSnackbar, ReloadPrompt } from "../ui";
import { AppBottomNavigation } from "./AppBottomNavigation";
import { AppDrawer } from "./AppDrawer";
import { AppHeader } from "./AppHeader";
import { AppNavItem } from "./types";

const MAIN_NAV_ITEMS: AppNavItem[] = [
  { path: "/import", label: "インポート", icon: <VerticalAlignBottomIcon /> },
  { path: "/tickets", label: "チケット一覧", icon: <ListAltIcon /> },
  { path: "/charts", label: "譜面一覧", icon: <LibraryMusicIcon /> },
];

const MORE_NAV_ITEM: AppNavItem = { path: "/more", label: "その他", icon: <MoreHorizIcon /> };

const EXTRA_NAV_ITEMS: AppNavItem[] = [
  { path: "/updates", label: "更新履歴", icon: <HistoryIcon /> },
  { path: "/about", label: "About", icon: <InfoIcon /> },
];

export const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const currentPath = location.pathname === "/" ? "/tickets" : location.pathname;
  const { open, message, severity, close: closeSnackbar } = useSnackbarStore();

  const bottomTabIndex = useMemo(() => {
    const bottomPaths = [...MAIN_NAV_ITEMS.map((item) => item.path), MORE_NAV_ITEM.path];
    const isExtraPath = EXTRA_NAV_ITEMS.some((item) => item.path === currentPath);
    const effectivePath = isExtraPath ? MORE_NAV_ITEM.path : currentPath;
    return bottomPaths.findIndex((path) => path === effectivePath);
  }, [currentPath]);

  const drawerNavItems = useMemo(() => [...MAIN_NAV_ITEMS, ...EXTRA_NAV_ITEMS], []);
  const drawerTabIndex = drawerNavItems.findIndex((item) => item.path === currentPath);

  const handleOpenMore = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchor(event.currentTarget);
  };

  const handleCloseMore = () => {
    setMoreAnchor(null);
  };

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
      {!isMobile && <AppDrawer navItems={drawerNavItems} tabIndex={drawerTabIndex} />}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <AppHeader />
        <Container
          component="main"
          maxWidth="md"
          sx={{
            flexGrow: 1,
            p: 2,
            pb: isMobile ? `calc(${theme.spacing(9)} + env(safe-area-inset-bottom, 0px))` : 2,
          }}
        >
          <Outlet />
        </Container>
      </Box>
      {isMobile && (
        <AppBottomNavigation
          navItems={MAIN_NAV_ITEMS}
          moreItem={MORE_NAV_ITEM}
          tabIndex={bottomTabIndex}
          onOpenMore={handleOpenMore}
        />
      )}
      <AppSnackbar open={open} onClose={closeSnackbar} message={message} severity={severity} />
      {!import.meta.env.SSR && <ReloadPrompt />}
      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={handleCloseMore}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {EXTRA_NAV_ITEMS.map((item) => (
          <MenuItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            onClick={handleCloseMore}
            sx={{ minWidth: 180 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
