import { useContext } from "react";
import { Contax } from "../contexts/ReducerContext";

export const useStore = () => useContext(Contax);
