import {
  Typography,
  Button,
  AppBar,
  Slide,
  Toolbar,
  IconButton,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";

import React, { forwardRef, useContext } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
// firebase
import { signOut } from "firebase/auth";
import { auth } from "../../../fireBaseConfig";
import { UserContext } from "../../contexts/UserContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LogOutDialog({ open, close }) {
  const { setUserInfo } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  async function handleLogout() {
    try {
      await signOut(auth);
      close();
      localStorage.removeItem("token");
      window.location.href = "/login";
      setUserInfo({
        Id: null,
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
      });
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        sx={{ zIndex: 10002 }}
      >
        <AppBar sx={{ position: "relative", direction: isRTL ? "rtl" : "ltr" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={close}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                marginLeft: isRTL ? "0" : "16px",
                marginRight: isRTL ? "16px" : "0",
              }}
              color={"inherit"}
            >
              {t("Logout")}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              sx={{
                display: "block",
                color: "white",
                textAlign: "center",
              }}
              onClick={handleLogout}
            >
              {t("Yes")}
            </Button>
            <Button
              autoFocus
              color="inherit"
              sx={{
                display: "block",
                color: "white",
                textAlign: "center",
              }}
              onClick={close}
            >
              {t("No")}
            </Button>
          </Toolbar>
        </AppBar>
        <Typography
          color="inherit"
          gutterBottom
          sx={{ textAlign: "center", padding: "60px", marginBottom: "12px" }}
          variant="h5"
        >
          {t("Are you sure you want to logout?")}
        </Typography>
      </Dialog>
    </>
  );
}

export default React.memo(LogOutDialog);

LogOutDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
};
