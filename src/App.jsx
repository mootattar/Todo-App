import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";

import CssBaseline from "@mui/material/CssBaseline";
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
import Home from "./pages/home";
import Header from "./components/Header";
import { useContext } from "react";
import SideBar from "./components/SideBar";
import { useMediaQuery } from "@mui/material";
import { ModeContext } from "./contexts/Mode";
import { useTranslation } from "react-i18next";
import { ToastProvider } from "./contexts/ToastContext";
import { DialogProvider } from "./contexts/DialogContext";

function App() {
  const { dark } = useContext(ModeContext);
  const { i18n } = useTranslation();
  const isHomePage = location.pathname === "/";
  const iSmall = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    document.querySelector("body").style.transition = "none";
    setTimeout(() => {
      document.querySelector("body").style.transition =
        "background-color 0.5s ease-in-out";
    }, 100);
  }, []);

  const theme = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      primary: {
        main: "#FF5722",
      },
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            transition: "background-color 0.5s ease-in-out",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition:
              "all 0.2s ease-in-out,background-color 0.5s ease-in-out !important",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            transition: "background-color 0.5s ease-in-out",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <ToastProvider>
          <DialogProvider>
            <div
              style={{
                display: isHomePage ? "flex" : iSmall ? "flex" : "block",
              }}
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <Header />
              <SideBar />
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </Suspense>
            </div>
          </DialogProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default React.memo(App);
// export default App;
