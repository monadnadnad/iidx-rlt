import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { StaticRouter } from "react-router";

import { WebApp } from "./app/WebApp";
import { getTheme } from "./theme";

export const render = (url: string, helmetContext: { helmet?: HelmetServerState }): string => {
  const theme = getTheme("light");

  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StaticRouter location={url}>
            <WebApp />
          </StaticRouter>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};
