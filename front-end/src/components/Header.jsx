import { AppBar, Toolbar, Button } from "@mui/material";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import Switch from "./Switch";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ModeContext } from "../contexts/Mode";

function Header() {
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

  return (
    <AppBar position="fixed" sx={{ zIndex: 10000 }}>
      <Toolbar
        sx={{ justifyContent: "flex-start", gap: 1, alignItems: "center" }}
      >
        <Button color="inherit" onClick={handleLang}>
          {isRTL ? "en" : "ar"}
        </Button>

        <Link to={"/"} style={{ textDecoration: "none", color: "white  " }}>
          {t("Todo App")}
        </Link>
        <Switch />
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(Header);
