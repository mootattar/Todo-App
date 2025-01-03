import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const ModeContext = createContext();

export default function ModeProvider({ children }) {
  const getInitialMode = () => {
    const savedMode = localStorage.getItem("mode");
    if (!savedMode || savedMode === "undefined") {
      return false;
    }
    try {
      return JSON.parse(savedMode);
    } catch (e) {
      console.error("Error parsing saved mode:", e);
      return false;
    }
  };
  const [dark, setDark] = useState(getInitialMode);
  return (
    <>
      <ModeContext.Provider value={{ dark, setDark }}>
        {children}
      </ModeContext.Provider>
    </>
  );
}

ModeProvider.propTypes = {
  children: PropTypes.node,
};
