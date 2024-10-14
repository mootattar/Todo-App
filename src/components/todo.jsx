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

import PropTypes from "prop-types";
import {
  Typography,
  Button,
  IconButton,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { makeStyles } from "@mui/styles";
import { AddCircle } from "@mui/icons-material";
import { Contax } from "../contexts/Contax";
import { UserContext } from "../contexts/UserContext";
import { DrawerContext } from "../contexts/ContextDrawer";
const AdDialog = lazy(() => import("./AdDialog"));
const EditDialog = lazy(() => import("./EditDialog"));
const DeleteDialog = lazy(() => import("./DeleteDialog"));

const useStyles = makeStyles((theme) => ({
  floatingButton: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
  toolbar: theme.mixins.toolbar,
}));

const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));

const TodoCard = React.memo(
  ({ todo, handleCheck, handleEditOpen, handleDeleteOpen }) => {
    TodoCard.displayName = "TodoCard";
    const { t } = useTranslation();
    const EditRef = useRef(null);
    const handleEdit = () => {
      handleEditOpen(todo);
      EditRef.current.blur();
    };

    return (
      <>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 4,
          }}
          key={todo.id}
          sx={{ maxWidth: 335 }}
        >
          <Card sx={{ maxWidth: 335 }} variant="outlined">
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                color={todo.attributes.ischecked ? "info" : "primary"}
                sx={{
                  textDecoration: todo.attributes.ischecked
                    ? "line-through"
                    : "none",
                }}
              >
                {todo.attributes.Title}
              </Typography>
              <Typography variant="body2" component="p">
                {todo.attributes.body}
              </Typography>
              <Typography color="textSecondary">
                {todo.attributes.Time}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="info"
                onClick={() => handleCheck(todo.attributes.ischecked, todo.id)}
              >
                {t("check")}
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={handleEdit}
                ref={EditRef}
              >
                {t("Edit")}
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDeleteOpen(todo)}
              >
                {t("Delete")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </>
    );
  }
);

const TodoUI = React.memo(() => {
  TodoUI.displayName = "TodoUI";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(null);

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

  const { state, dispatch } = useContext(Contax);
  const { selected } = useContext(DrawerContext);
  const classes = useStyles();

  const { userInfo } = useContext(UserContext);

  const filteredTodos = useMemo(() => {
    switch (selected) {
      case "Completed":
        return state.todos.filter((todo) => todo.attributes.ischecked);
      case "Uncompleted":
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
        const response = await fetch(`http://localhost:1337/api/todos/${id}`, {
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
      } catch (error) {
        dispatch({ type: "completed", payload: id });
        dispatch({ type: "UpdateTodosFailure", payload: error.message });
      }
    },
    [dispatch]
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
          `http://localhost:1337/api/todos?filters[userId]=${userInfo.Id}`
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
          id={deleteTodo?.id || null}
        />
      </Suspense>
      <main style={{ flexGrow: 1, padding: "20px 50px" }}>
        <div className={classes.toolbar} />

        <IconButton
          className={classes.floatingButton}
          color="primary"
          aria-label="Add Todo"
          onClick={handleAdd}
          ref={AddbuttonRef}
        >
          <AddCircle style={{ fontSize: 60 }} />
        </IconButton>

        <Grid container spacing={2}>
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              handleCheck={handleCheckMemo}
              handleEditOpen={handleEditOpen}
              handleDeleteOpen={handleDeleteOpen}
            />
          ))}
        </Grid>
      </main>
    </>
  );
});

export default React.memo(TodoUI);

TodoCard.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    attributes: PropTypes.shape({
      ischecked: PropTypes.bool.isRequired,
      Title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      Time: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  handleCheck: PropTypes.func.isRequired,
  handleEditOpen: PropTypes.func.isRequired,
  handleDeleteOpen: PropTypes.func.isRequired,
};
