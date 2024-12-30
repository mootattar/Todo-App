import { useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import todosReducer from "../Reducers/TodosReduscer";
import { initialState } from "../Reducers/TodosReduscer";
import { DrawerContext } from "./ContextDrawer";
import { createContext } from "react";

export const Contax = createContext();
export default function ReducerContext({ children }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const { error } = useContext(DrawerContext);

  const contextValue = useMemo(
    () => ({
      state,
      error,
      dispatch,
    }),
    [state, error, dispatch]
  );

  return <Contax.Provider value={contextValue}>{children}</Contax.Provider>;
}

ReducerContext.propTypes = {
  children: PropTypes.node.isRequired,
};
