import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@amplience/ui-styles/style.css";
import { ThemeProvider } from "@amplience/ui-styles";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
