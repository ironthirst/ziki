import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
// import validator from "validator";

// import { App } from "./components/App";
import { App } from "./App";
import { store } from "./rx/store";
import { mainTheme } from "./styles/themes/mainTheme";
import { GlobalStyle } from "./styles/globalStyle";

import { bootstrap } from "./bootstrap";

bootstrap();

// install our own no-op console log if one not present
if (!window.console) {
  window.console = {
    log() {
      /* no-op */
    },
    warn() {
      /* no-op */
    },
    error() {
      /* no-op */
    },
  } as any;
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <GlobalStyle />
      <ThemeProvider theme={mainTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
