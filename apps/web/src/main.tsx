import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { PwaUpdatePrompt } from "./components/PwaUpdatePrompt";
import { store } from "./state/store";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter><PwaUpdatePrompt /><App /></BrowserRouter>
    </Provider>
  </StrictMode>
);
