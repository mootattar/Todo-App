import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../fireBaseConfig";
import { useStore } from "./useStore";

import { writeBatch } from "firebase/firestore";
import { useToast } from "./useToast";

export const useTaskStatus = () => {
  const { state, dispatch } = useStore();
  const { handleShow } = useToast();

  const handleCheck = async (todo, id, t) => {
    dispatch({ type: "completed", payload: id });
    handleShow(t("Task Completed Successfully"));
    try {
      const todosCollection = collection(db, "todos");
      const q = query(todosCollection, where("id", "==", id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const todoDoc = querySnapshot.docs[0];
        const todoRef = doc(db, "todos", todoDoc.id);

        await updateDoc(todoRef, {
          ischecked: !todo.ischecked,
          pending:
            todo.endOfDay > new Date().toISOString() ? !todo.pending : false,
        });
      } else {
        console.error("No document found with the given external ID.");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const updateTask = async (tasks) => {
    const batch = writeBatch(db);
    for (const todo of tasks) {
      try {
        const todosCollection = collection(db, "todos");
        const q = query(todosCollection, where("id", "==", todo.id));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const todoDoc = querySnapshot.docs[0];
          const todoRef = doc(db, "todos", todoDoc.id);

          batch.update(todoRef, { pending: false });
        }
      } catch (e) {
        console.error(`Error updating task ${todo.id}: `, e);
      }
    }

    // Commit the batch write
    await batch.commit();
  };

  const checkAndUpdateTasks = async () => {
    const tasksToUpdate = [];
    if (state.todos.length === 0) return;
    for (const task of state.todos) {
      const now = new Date();
      if (task.pending && task.endOfDay < now.toISOString()) {
        // Add the task to the update list
        tasksToUpdate.push({
          id: task.id,
          pending: false,
        });

        dispatch({
          type: "checkAndUpdateTasks",
          payload: { id: task.id },
        });
      }
    }

    if (tasksToUpdate.length > 0) {
      await updateTask(tasksToUpdate);
    }
  };
  return { checkAndUpdateTasks, handleCheck };
};
