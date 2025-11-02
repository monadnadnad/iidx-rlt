import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";

import { WebApp } from "./WebApp";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (measurementId) {
  ReactGA.initialize(measurementId);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <WebApp />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
