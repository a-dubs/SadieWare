/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline } from "@mui/joy";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./core/store";
import { Router } from "./routes/index";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <SnackbarProvider>
      <CssBaseline />
      <StoreProvider>
        <Router />
      </StoreProvider>
    </SnackbarProvider>
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
