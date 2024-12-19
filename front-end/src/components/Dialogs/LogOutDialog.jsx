import {
  Typography,
  Button,
  AppBar,
  Slide,
  Toolbar,
  IconButton,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";

import React, { forwardRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LogOutDialog({ open, close }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

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
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
