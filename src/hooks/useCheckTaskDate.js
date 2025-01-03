import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../fireBaseConfig";
import { useStore } from "./useStore";

import { writeBatch } from "firebase/firestore";

export const useCheckTaskDate = () => {
  const { state, dispatch } = useStore();
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
  return { checkAndUpdateTasks };
};
