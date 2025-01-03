import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const DrawerContext = createContext();

export default function DrawerProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All");
  const showHideDrawer = () => {
    setOpen(!open);
  };

  return (
    <DrawerContext.Provider
      value={{
        open,
        showHideDrawer,
        selected,
        setSelected,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

DrawerProvider.propTypes = {
  children: PropTypes.node,
};
