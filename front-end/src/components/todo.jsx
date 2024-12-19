import React, {
  lazy,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  Suspense,
  useRef,
} from "react";
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
import { useToast } from "../contexts/ToastContext";
import { useStore } from "../contexts/ReducerContext";
// Actions Icons
const AdDialog = lazy(() => import("./Dialogs/AdDialog"));
const EditDialog = lazy(() => import("./Dialogs/EditDialog"));
const DeleteDialog = lazy(() => import("./Dialogs/DeleteDialog"));
// mainURL
const mainUrl = import.meta.env.VITE_MAIN_URL;

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(null);
  const { t, i18n } = useTranslation();
  const IsRtl = i18n.language === "ar";
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const AddbuttonRef = useRef(null);

  const handleDeleteOpen = useCallback((todo) => {
    setDeleteDialogOpen(true);
    setDeleteTodo(todo);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteTodo(null);
  }, []);

  const handleAdd = useCallback(() => {
    AddbuttonRef.current.blur();
    setAddDialogOpen(!addDialogOpen);
  }, [addDialogOpen]);
  const handleEditOpen = useCallback((todo) => {
    setTodoToEdit(todo);
    setEditDialogOpen(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditDialogOpen(false);
    setTodoToEdit(null);
  }, []);

  const { state, dispatch } = useStore();
  const { selected } = useContext(DrawerContext);
  const classes = useStyles();

  const { userInfo } = useContext(UserContext);
  const { handleShow } = useToast();

  const filteredTodos = useMemo(() => {
    switch (selected) {
      case "Home":
        return state.todos.filter((todo) => todo.attributes.cat === "Home");
      case "Work":
        return state.todos.filter((todo) => todo.attributes.cat === "Work");
      case "Personal":
        return state.todos.filter((todo) => todo.attributes.cat === "Personal");
      case "Health":
        return state.todos.filter((todo) => todo.attributes.cat === "Health");
      case "Study":
        return state.todos.filter((todo) => todo.attributes.cat === "Study");
      case "Devotional":
        return state.todos.filter(
          (todo) => todo.attributes.cat === "Devotional"
        );
      case "Other":
        return state.todos.filter((todo) => todo.attributes.cat === "Other");
      case "Completed":
        return state.todos.filter((todo) => todo.attributes.ischecked);
      case "Pending":
        return state.todos.filter((todo) => !todo.attributes.ischecked);
      case "All":
      default:
        return state.todos;
    }
  }, [selected, state.todos]);

  const handleCheck = useCallback(
    async (ischecked, id) => {
      dispatch({ type: "completed", payload: id });
      try {
        const response = await fetch(`${mainUrl}/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              ischecked: !ischecked,
            },
          }),
        });
        if (!response.ok) {
          return;
        }
        if (!ischecked) {
          handleShow("Task Completed Successfully");
        }
      } catch (error) {
        dispatch({ type: "completed", payload: id });
        dispatch({ type: "UpdateTodosFailure", payload: error.message });
      }
    },
    [dispatch, handleShow]
  );

  const handleCheckMemo = useCallback(
    (ischecked, id) => {
      handleCheck(ischecked, id);
    },
    [handleCheck]
  );

  useEffect(() => {
    const getTodos = async () => {
      dispatch({ type: "FETCH_TODOS_REQUEST" });
      try {
        const res = await fetch(
          `${mainUrl}/api/todos?filters[userId]=${userInfo.Id}`
        );
        const data = await res.json();
        dispatch({
          type: "FETCH_TODOS_SUCCESS",
          payload: data.data.filter(
            (todo) => todo.attributes.userId === userInfo.Id
          ),
        });
      } catch (error) {
        console.error("Error fetching todos:", error);
        dispatch({ type: "FETCH_TODOS_FAILURE", payload: error.message });
      }
    };
    if (userInfo.Id) getTodos();
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
      <Suspense fallback={<div>Loading...</div>}>
        <EditDialog
          title={todoToEdit?.attributes.Title || ""}
          body={todoToEdit?.attributes.body || ""}
          cat={todoToEdit?.attributes.cat || "Other"}
          open={editDialogOpen}
          close={handleEditClose}
          id={todoToEdit?.id || null}
          ischecked={todoToEdit?.attributes.ischecked || false}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <AdDialog open={addDialogOpen} close={handleAdd} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <DeleteDialog
          open={deleteDialogOpen}
          close={handleDeleteClose}
          title={deleteTodo?.attributes.Title || ""}
          body={deleteTodo?.attributes.body || ""}
          cat={deleteTodo?.attributes.cat || "Other"}
          id={deleteTodo?.id || null}
        />
      </Suspense>
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
            onClick={handleAdd}
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
                  categories.find((cat) => cat.title === todo.attributes.cat)
                    .color || "#29b6f6"
                }
                todo={todo}
                handleCheck={handleCheckMemo}
                handleEditOpen={handleEditOpen}
                handleDeleteOpen={handleDeleteOpen}
              />
            </div>
          ))}
        </Grid>
      </main>
    </>
  );
});

export default React.memo(TodoUI);
