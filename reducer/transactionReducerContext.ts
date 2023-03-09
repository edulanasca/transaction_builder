import {createContext, Dispatch} from "react";
import {Action} from "./transactionReducer";

export const TransactionReducerContext = createContext<Dispatch<Action>>(() => {});