import React, { useCallback, useContext, useEffect, useState } from "react";
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
import LogOutDialog from "./Dialogs/LogOutDialog";
import { useStore } from "../contexts/ReducerContext";

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

function SideBar() {
  const { state } = useStore();
  const [count, setCount] = useState({
    All: 0,
    Completed: 0,
    Pending: 0,
    Home: 0,
    Personal: 0,
    Health: 0,
    Study: 0,
    Other: 0,
  });
  const TodosNumber = () => {
    const All = state.todos.length;
    const Completed = state.todos.filter((todo) => todo.ischecked).length;
    const Pending = state.todos.filter((todo) => !todo.ischecked).length;
    const Home = state.todos.filter((todo) => todo.cat === "Home").length;
    const Personal = state.todos.filter(
      (todo) => todo.cat === "Personal"
    ).length;
    const Health = state.todos.filter((todo) => todo.cat === "Health").length;
    const Study = state.todos.filter((todo) => todo.cat === "Study").length;
    const Other = state.todos.filter((todo) => todo.cat === "Other").length;
    setCount({
      All,
      Completed,
      Pending,
      Home,
      Personal,
      Health,
      Study,
      Other,
    });
  };
  useEffect(() => {
    TodosNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
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
  const values = [
    {
      value: "Home",
    },
    {
      value: "Personal",
    },
    {
      value: "Study",
    },
    {
      value: "Health",
    },
    {
      value: "Other",
    },
  ];
  const style = {
    borderLeft: "none",
    borderRight: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  };
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
          <Avatar className={classes.avatar} />
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
              <ToggleButton value="All" aria-label="All" sx={style}>
                <FontAwesomeIcon icon={faList} />
                {t("All")}
                <span style={{ fontWeight: "bold" }}>{count.All}</span>
              </ToggleButton>

              <ToggleButton value="Completed" aria-label="Completed" sx={style}>
                <FontAwesomeIcon icon={faListCheck} />
                {t("Completed")}
                <span style={{ fontWeight: "bold" }}>{count.Completed}</span>
              </ToggleButton>

              <ToggleButton value="Pending" aria-label="Pending" sx={style}>
                <FontAwesomeIcon icon={faClock} />
                {t("Pending")}
                <span style={{ fontWeight: "bold" }}>{count.Pending}</span>
              </ToggleButton>
              {values.map((value) => (
                <ToggleButton
                  key={value.value}
                  value={value.value}
                  aria-label={value.value}
                  sx={style}
                >
                  {t(value.value)}
                  <span style={{ fontWeight: "bold" }}>
                    {count[value.value]}
                  </span>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Button
              value="Logout"
              aria-label="Logout"
              sx={style}
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

export default React.memo(SideBar);
