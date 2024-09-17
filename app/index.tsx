/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline } from "@mui/joy";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./core/store";
import { Provider } from "react-redux"; // Import Provider from react-redux
import store from "./store"; // Import your Redux store
import { Router } from "./routes/index";
import { setupRealTimeListeners, fetchInitialData } from "./services/supabaseService";  // Import setup functions

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <SnackbarProvider>
      <CssBaseline />
      <Provider store={store}>  {/* Wrap the app in the Redux Provider and pass the store */}
        <StoreProvider>
          <Router />
        </StoreProvider>
      </Provider>
    </SnackbarProvider>
  </StrictMode>,
);

// Set up real-time listeners and fetch initial state
fetchInitialData();  // Fetch the initial data immediately
setupRealTimeListeners();  // Start listening for real-time updates

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
