import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserContextProvider from "./contexts/UserContext";
import ReducerContext from "./contexts/ReducerContext";

import "./i18n";
import "./App.css";
import ModeProvider from "./contexts/Mode";
import DrawerProvider from "./contexts/ContextDrawer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ModeProvider>
      <UserContextProvider>
        <DrawerProvider>
          <ReducerContext>
            <App />
          </ReducerContext>
        </DrawerProvider>
      </UserContextProvider>
    </ModeProvider>
  </React.StrictMode>
);
