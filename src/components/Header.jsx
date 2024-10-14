import { AppBar, Toolbar, Button } from "@mui/material";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import Switch from "../components/Switch";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ModeContext } from "../contexts/Mode";

function Header() {
  console.log("reRendered the Header component");
  const { dark } = useContext(ModeContext);
  const { t, i18n } = useTranslation();
  const isRTL = useMemo(() => i18n.language === "ar", [i18n.language]);

  useEffect(() => {
    if (dark !== undefined) {
      localStorage.setItem("mode", JSON.stringify(dark));
    }
  }, [dark]);

  const handleLang = useCallback(() => {
    i18n.changeLanguage(isRTL ? "en" : "ar");
  }, [i18n, isRTL]);

  const location = useLocation();

  const linkTo = useMemo(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      return location.pathname;
    }
    return "/";
  }, [location.pathname]);
  return (
    <AppBar position="fixed" sx={{ zIndex: 10000 }}>
      <Toolbar
        sx={{ justifyContent: "flex-start", gap: 1, alignItems: "center" }}
      >
        <Button color="white" onClick={handleLang}>
          {i18n.language === "en" ? "ar" : "en"}
        </Button>

        <Link to={linkTo} style={{ textDecoration: "none", color: "white  " }}>
          {t("Todo App")}
        </Link>
        <Switch />
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(Header);
