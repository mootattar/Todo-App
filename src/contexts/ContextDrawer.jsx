import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const DrawerContext = createContext();

export default function DrawerProvider({ children }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("All");
  const [error, setError] = useState("");

  const [drawer, setDrawer] = useState({
    open: false,
    description: "",
    title: "",
    body: "",
    id: null,
  });

  return (
    <DrawerContext.Provider
      value={{
        open,
        setOpen,
        selected,
        setSelected,
        drawer,
        setDrawer,
        error,
        setError,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

DrawerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
