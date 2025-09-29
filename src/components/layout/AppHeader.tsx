import { alpha, AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";
import ReactGA from "react-ga4";

const APP_TITLE = "RLT Manager";
const SURVEY_URL = "https://forms.gle/8PTuYZgbyFJwpEgu9";

const handleSurveyClick = () => {
  ReactGA.event({
    category: "UserAction",
    action: `Click Google Form (Header)`,
  });
};

export const AppHeader: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
        color: "text.primary",
        backdropFilter: "blur(6px)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {APP_TITLE}
        </Typography>
        <Button
          component={Link}
          href={SURVEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          onClick={handleSurveyClick}
        >
          フィードバック
        </Button>
      </Toolbar>
    </AppBar>
  );
};
