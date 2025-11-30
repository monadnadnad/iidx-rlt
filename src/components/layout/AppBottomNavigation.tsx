import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Link } from "react-router";
import { AppNavItem } from "./types";

interface AppBottomNavigationProps {
  navItems: AppNavItem[];
  moreItem: AppNavItem;
  tabIndex: number;
  onOpenMore: (event: React.MouseEvent<HTMLElement>) => void;
}

export const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({
  navItems,
  moreItem,
  tabIndex,
  onOpenMore,
}) => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        pb: "env(safe-area-inset-bottom, 0px)",
      }}
      elevation={3}
    >
      <BottomNavigation showLabels={false} value={tabIndex}>
        {navItems.map((tab) => (
          <BottomNavigationAction
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            component={Link}
            to={tab.path}
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.5rem",
              },
              "&.Mui-selected .MuiBottomNavigationAction-label": {
                fontSize: "0.5rem",
              },
            }}
          />
        ))}
        <BottomNavigationAction
          key={moreItem.path}
          label={moreItem.label}
          icon={moreItem.icon}
          component="button"
          onClick={onOpenMore}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.5rem",
            },
            "&.Mui-selected .MuiBottomNavigationAction-label": {
              fontSize: "0.5rem",
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};
