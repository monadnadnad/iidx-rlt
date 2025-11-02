import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Link } from "react-router";
import { AppNavItem } from "../../types";

interface AppBottomNavigationProps {
  navItems: AppNavItem[];
  tabIndex: number;
}

export const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({ navItems, tabIndex }) => {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.appBar }}
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
      </BottomNavigation>
    </Paper>
  );
};
