import { useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { Contax } from "./Contax";
import todosReducer from "../Reducers/TodosReduscer";
import { initialState } from "../Reducers/TodosReduscer";
import { DrawerContext } from "./ContextDrawer";

export default function Contexts({ children }) {
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

Contexts.propTypes = {
  children: PropTypes.node.isRequired,
};
