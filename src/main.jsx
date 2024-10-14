import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Contexts from "./contexts/Contexts";
import UserContextProvider from "./contexts/UserContext";

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
          <Contexts>
            <App />
          </Contexts>
        </DrawerProvider>
      </UserContextProvider>
    </ModeProvider>
  </React.StrictMode>
);
