import { createContext, useState } from "react";
import PropTypes from "prop-types";
import Toast from "../shared/Toast";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleShow = (message) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };
  return (
    <ToastContext.Provider value={{ handleShow }}>
      <Toast open={open} setOpen={setOpen} message={message} />
      {children}
    </ToastContext.Provider>
  );
};
ToastProvider.propTypes = {
  children: PropTypes.node,
};
