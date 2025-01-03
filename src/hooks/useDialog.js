import { useContext } from "react";
import { DialogContext } from "../contexts/DialogContext";

export const useShowHideDialog = () => {
  return useContext(DialogContext);
};
