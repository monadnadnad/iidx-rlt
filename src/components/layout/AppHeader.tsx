import { alpha, AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router";

import { trackFeedbackClick } from "../../analytics/events";

const APP_TITLE = "RLT Manager";
const SURVEY_URL = "https://forms.gle/8PTuYZgbyFJwpEgu9";

const handleSurveyClick = () => {
  trackFeedbackClick();
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
