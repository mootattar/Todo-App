import { v4 as uuidv4 } from "uuid";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../fireBaseConfig";

export const useSendData = () => {
  const editTodo = async (
    details,
    setError,
    t,
    todo,
    dispatch,
    handleClose,
    handleShow
  ) => {
    if (details.title.trim().length < 1 && details.body.trim().length < 1) {
      setError(t("you Cannot make the task empty"));
      return;
    }
    dispatch({
      type: "updateTodo",
      payload: {
        id: todo.id,
        Title: details.title,
        body: details.body,
        cat: details.cat,
        ischecked: todo.ischecked,
      },
    });
    handleClose();
    handleShow("Task updated successfully");
    try {
      const todosCollection = collection(db, "todos");
      const q = query(todosCollection, where("id", "==", todo.id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const todoDoc = querySnapshot.docs[0];
        const todoRef = doc(db, "todos", todoDoc.id);

        await updateDoc(todoRef, {
          Title: details.title,
          body: details.body,
          cat: details.cat,
        });
      } else {
        console.error("No document found with the given external ID.");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  const addTodoToAPI = async (
    details,
    setError,
    t,
    userInfo,
    dispatch,
    handleClose,
    handleShow
  ) => {
    if (details.title.trim().length < 1 && details.body.trim().length < 1) {
      setError(t("you Cannot add an empty task"));
      return;
    }
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const formattedDate = now.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      hour12: true,
    });

    const localTodo = {
      id: uuidv4(),
      Title: details.title,
      body: details.body,
      Time: formattedDate,
      userId: userInfo.Id,
      ischecked: false,
      cat: details.cat,
      pending: true,
      endOfDay: endOfDay.toISOString(),
    };

    dispatch({
      type: "CREATE_TODOS_SUCCESS",
      payload: localTodo,
    });
    handleClose();
    handleShow(t("Task added successfully"));

    try {
      await addDoc(collection(db, "todos"), localTodo);
    } catch (error) {
      console.error("Error adding document: ", error);
      setError(t("Failed to add the task."));
    }
  };
  const deleteOne = async ({ todo, dispatch, close, handleShow }) => {
    dispatch({
      type: "deleteTodo",
      payload: { id: todo?.id },
    });
    close();
    handleShow("Task deleted successfully");
    try {
      const todosCollection = collection(db, "todos");
      const q = query(todosCollection, where("id", "==", todo?.id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const todoDoc = querySnapshot.docs[0];
        const todoRef = doc(db, "todos", todoDoc.id);
        await deleteDoc(todoRef);
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch({ type: "Delete_TODOS_FAILURE", payload: error.message });
    }
  };
  return {
    addTodoToAPI,
    editTodo,
    deleteOne,
  };
};
