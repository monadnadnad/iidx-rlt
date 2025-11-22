import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { Route, Routes } from "react-router";

import { Layout } from "../components/layout/Layout";
import { AboutPage } from "../pages/AboutPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TicketImporterPage } from "../pages/TicketImporterPage";
import { TicketViewPage } from "../pages/TicketViewPage";
import { HistoryPage } from "../pages/HistoryPage";
import { getTheme } from "../theme";

export const WebApp: React.FC = () => {
  const theme = useMemo(() => getTheme("light"), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="import" element={<TicketImporterPage />} />
          <Route path="sample" element={<TicketViewPage isSample={true} />} />
          <Route path="tickets" element={<TicketViewPage />} />
          <Route path="updates" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};
