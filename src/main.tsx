import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Extension from "./Extension.tsx";

import "@amplience/ui-styles/style.css";
import { ThemeProvider } from "@amplience/ui-styles";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Extension />
    </ThemeProvider>
  </StrictMode>
);
