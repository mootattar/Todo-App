import React, { lazy, useContext, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
// mui components

import { Typography, IconButton, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { makeStyles } from "@mui/styles";
import { AddCircle } from "@mui/icons-material";
// contexts
import { UserContext } from "../contexts/UserContext";
import { DrawerContext } from "../contexts/ContextDrawer";
// components
import TodoCard from "./TodoCard";
import { useToast } from "../hooks/useToast";
import { useStore } from "../hooks/useStore";
// firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../fireBaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useCheckTaskDate } from "../hooks/useCheckTaskDate";
import { useShowHideDialog } from "../hooks/useDialog";

const useStyles = makeStyles((theme) => ({
  floatingButton: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
  toolbar: theme.mixins.toolbar,
}));

const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));

const TodoUI = React.memo(() => {
  TodoUI.displayName = "TodoUI";
  const { t, i18n } = useTranslation();
  const IsRtl = i18n.language === "ar";
  // useRef
  const AddbuttonRef = useRef(null);
  // contexts
  const { selected } = useContext(DrawerContext);
  const { userInfo } = useContext(UserContext);

  const handleShowAdd = () => {
    handleAdd();
    AddbuttonRef.current.blur();
  };

  // custom hooks
  const { state, dispatch } = useStore();
  const classes = useStyles();
  const { handleShow } = useToast();
  const { handleAdd } = useShowHideDialog();
  const { checkAndUpdateTasks } = useCheckTaskDate();
  // categories
  const categories = [
    {
      title: "Home",
      color: "#39d9c9",
    },
    {
      title: "Personal",
      color: "#f3a2c3",
    },
    {
      title: "Health",
      color: "#29f83f",
    },
    {
      title: "Study",
      color: "#29b6f6",
    },
    {
      title: "Other",
      color: "#ff8a65",
    },
  ];

  const filteredTodos = useMemo(() => {
    switch (selected) {
      case "Home":
        return state.todos.filter(
          (todo) => todo.cat === "Home" && todo.endOfDay > todo.date
        );
      case "Work":
        return state.todos.filter(
          (todo) => todo.cat === "Work" && todo.endOfDay > todo.date
        );
      case "Personal":
        return state.todos.filter(
          (todo) => todo.cat === "Personal" && todo.endOfDay > todo.date
        );
      case "Health":
        return state.todos.filter(
          (todo) => todo.cat === "Health" && todo.endOfDay > todo.date
        );
      case "Study":
        return state.todos.filter(
          (todo) => todo.cat === "Study" && todo.endOfDay > todo.date
        );
      case "Devotional":
        return state.todos.filter(
          (todo) => todo.cat === "Devotional" && todo.endOfDay > todo.date
        );
      case "Other":
        return state.todos.filter(
          (todo) => todo.cat === "Other" && todo.endOfDay > todo.date
        );
      case "Completed":
        return state.todos.filter((todo) => todo.ischecked);
      case "Pending":
        return state.todos.filter((todo) => todo.pending);
      case "Uncompleted":
        return state.todos.filter((todo) => !todo.pending && !todo.ischecked);
      case "All":
        return state.todos.filter((todo) => {
          return todo.endOfDay > new Date().toISOString();
        });
      default:
        return state.todos;
    }
  }, [selected, state.todos]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndUpdateTasks();
    }, 60000);
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.todos.length]);

  const handleCheck = async (todo, id) => {
    dispatch({ type: "completed", payload: id });
    handleShow("Task Completed Successfully");
    try {
      const todosCollection = collection(db, "todos");
      const q = query(todosCollection, where("id", "==", id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const todoDoc = querySnapshot.docs[0];
        const todoRef = doc(db, "todos", todoDoc.id);

        await updateDoc(todoRef, {
          ischecked: !todo.ischecked,
          pending: !todo.pending,
        });
      } else {
        console.error("No document found with the given external ID.");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  useEffect(() => {
    const getTodos = async () => {
      dispatch({ type: "FETCH_TODOS_REQUEST" });
      try {
        if (!userInfo.Id) return;

        const q = query(
          collection(db, "todos"),
          where("userId", "==", userInfo.Id)
        );

        const querySnapshot = await getDocs(q);
        const todos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch({
          type: "FETCH_TODOS_SUCCESS",
          payload: todos,
        });
      } catch (error) {
        console.error("Error fetching todos:", error);
        dispatch({ type: "FETCH_TODOS_FAILURE", payload: error.message });
      }
    };

    getTodos();
  }, [userInfo.Id, dispatch]);

  if (state.loading) {
    return (
      <main style={{ flexGrow: 1, padding: "20px 50px" }}>
        <div className={classes.toolbar} />
        <div
          style={{
            position: "fixed",
            zIndex: 1000,
            height: "31px",
            width: "31px",
            left: "50%",
            top: "35%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="secondary" />
        </div>
      </main>
    );
  }

  return (
    <>
      <main style={{ flexGrow: 1, padding: "20px 50px" }}>
        <div className={classes.toolbar} />

        <Tooltip
          title={t("Create a new Todo")}
          placement={IsRtl ? "left" : "right"}
          arrow
        >
          <IconButton
            className={classes.floatingButton}
            color="primary"
            aria-label="Add Todo"
            onClick={handleShowAdd}
            ref={AddbuttonRef}
          >
            <AddCircle style={{ fontSize: 60 }} />
          </IconButton>
        </Tooltip>

        <Grid container spacing={2}>
          {filteredTodos.length === 0 && (
            <Grid xs={12} style={{ textAlign: "center" }}>
              <Typography variant="h6" color="textSecondary">
                {t("No todos found")}
              </Typography>
            </Grid>
          )}
          {filteredTodos.map((todo, index) => (
            <div className={`animateY delay${index}`} key={todo.id}>
              <TodoCard
                color={
                  categories.find((cat) => cat.title === todo.cat).color ||
                  "#29b6f6"
                }
                todo={todo}
                handleCheck={handleCheck}
              />
            </div>
          ))}
        </Grid>
      </main>
    </>
  );
});

export default React.memo(TodoUI);
