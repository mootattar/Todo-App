import { createContext, useContext } from "react";

export const TodoContext = createContext();

export const useStore = () => useContext(TodoContext);
