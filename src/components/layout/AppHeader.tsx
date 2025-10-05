import { alpha, AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";
import ReactGA from "react-ga4";
import { Link as RouterLink } from "react-router-dom";

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
        <Link component={RouterLink} to="/" color="inherit" underline="none">
          <Typography variant="h6" component="div">
            {APP_TITLE}
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
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
