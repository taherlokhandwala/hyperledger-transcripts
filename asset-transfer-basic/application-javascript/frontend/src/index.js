import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { LedgerContextProvider } from "./context/LedgerContext";

ReactDOM.render(
  <LedgerContextProvider>
    <App />
  </LedgerContextProvider>,
  document.getElementById("root")
);
