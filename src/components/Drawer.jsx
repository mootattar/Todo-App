import React, { useCallback, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faList,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { ToggleButton, ToggleButtonGroup, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { UserContext } from "../contexts/UserContext";
import { DrawerContext } from "../contexts/ContextDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useTranslation } from "react-i18next";
import LogOutDialog from "./LogOutDialog";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    transition: "all 0.2s ease-in-out",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20,
  },
  toolbar: theme.mixins.toolbar,
}));

function Dra() {
  const classes = useStyles();
  const { open, selected, setOpen, setSelected } = useContext(DrawerContext);
  const [LogOutDialogOpen, setLogOutDialogOpen] = useState(false);
  const handleLogoutDialog = useCallback(() => {
    setLogOutDialogOpen(!LogOutDialogOpen);
  }, [LogOutDialogOpen]);
  const { userInfo } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const handleSelection = (event, newSelection) => {
    if (newSelection !== null) {
      setSelected(newSelection);
    }
  };

  const handleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);
  return (
    <>
      <LogOutDialog open={LogOutDialogOpen} close={handleLogoutDialog} />
      <Button
        sx={{
          position: "fixed",
          zIndex: 10000,
          [isRTL ? "right" : "left"]: 0,
          top: 70,
        }}
        color="primary"
        onClick={handleOpen}
      >
        {open ? (
          <MenuOpenIcon
            sx={{ transform: isRTL ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        ) : (
          <MenuIcon />
        )}
      </Button>
      <Drawer
        className={classes.drawer}
        open={open}
        anchor={isRTL ? "right" : "left"}
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        sx={{ width: open ? drawerWidth : 0 }}
      >
        <div className={classes.toolbar} />
        <center>
          <Avatar src={userInfo.profilePicture} className={classes.avatar} />
          <p>{userInfo.userName}</p>
        </center>
        <Divider />

        {userInfo.userName ? (
          <>
            <ToggleButtonGroup
              value={selected}
              exclusive
              onChange={handleSelection}
              aria-label="todo actions"
              orientation="vertical"
              fullWidth
            >
              <ToggleButton
                value="All"
                aria-label="All"
                sx={{
                  borderLeft: "none",
                  borderRight: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FontAwesomeIcon icon={faList} />
                {t("All")}
              </ToggleButton>

              <ToggleButton
                value="Completed"
                aria-label="Completed"
                sx={{
                  borderLeft: "none",
                  borderRight: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FontAwesomeIcon icon={faListCheck} />
                {t("Completed")}
              </ToggleButton>

              <ToggleButton
                value="Uncompleted"
                aria-label="Uncompleted"
                sx={{
                  borderLeft: "none",
                  borderRight: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FontAwesomeIcon icon={faClock} />
                {t("Uncompleted")}
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              value="Logout"
              aria-label="Logout"
              sx={{
                borderLeft: "none",
                borderRight: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
              onClick={handleLogoutDialog}
            >
              <ExitToAppIcon />
              {t("Logout")}
            </Button>
          </>
        ) : (
          <>
            <ToggleButtonGroup
              value={selected}
              exclusive
              onChange={handleSelection}
              aria-label="todo actions"
              orientation="vertical"
              fullWidth
            >
              <Link to="/login" style={{ textDecoration: "none" }}>
                <ToggleButton
                  value="Sign In"
                  sx={{
                    borderWidth: "0.5px",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {t("Sign In")}
                </ToggleButton>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <ToggleButton
                  value="Sign Up"
                  sx={{
                    borderWidth: "0.5px",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {t("Sign Up")}
                </ToggleButton>
              </Link>
            </ToggleButtonGroup>
          </>
        )}
      </Drawer>
    </>
  );
}

export default React.memo(Dra);
