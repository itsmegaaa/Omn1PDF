// Must be imported before React so the DOM-prototype patch is installed
// before React's commit phase runs. Prevents browser page translators
// (Edge / Google Translate / extensions) from crashing the app via
// parent-mismatch DOMExceptions. See the module for details.
import "@editor/utils/patchDomForTranslators";
// WebKit is missing several APIs the app assumes (ReadableStream async
// iteration, which pdf.js needs for all text extraction; requestIdleCallback).
import "@editor/utils/engineShims";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../vite-env.d.ts"; // oxlint-disable-line no-restricted-imports -- Outside app paths
import "@editor/styles/index.css"; // Import global styles
import React from "react";
import ReactDOM from "react-dom/client";
import { ColorSchemeScript } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import App from "@editor/App";
import "@editor/i18n"; // Initialize i18next
import { BASE_PATH } from "@editor/constants/app";
import { applyDevWorktreeLabel } from "@editor/utils/applyDevWorktreeLabel";

applyDevWorktreeLabel();

// Ensure all browser fetch() requests to backend API bypass ngrok browser warning interstitial
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    if (
      url.startsWith("/api/") ||
      url.startsWith("/v1/") ||
      url.includes("ngrok-free.dev")
    ) {
      const headers = new Headers(
        init?.headers ?? (input instanceof Request ? input.headers : undefined),
      );
      if (!headers.has("ngrok-skip-browser-warning")) {
        headers.set("ngrok-skip-browser-warning", "true");
      }
      return originalFetch(input, { ...init, headers });
    }
    return originalFetch(input, init);
  };
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = ReactDOM.createRoot(container); // Finds the root DOM element
root.render(
  <React.StrictMode>
    <ColorSchemeScript />
    <BrowserRouter basename={BASE_PATH}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
