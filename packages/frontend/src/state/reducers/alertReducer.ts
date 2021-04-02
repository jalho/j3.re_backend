import { Reducer } from "react";
import { State, Action } from "../../types";
import { initialState } from "../rootReducer";
import { asAlert } from "../../utils/helpers";

export const alertReducer: Reducer<State, Action> = (state, action) => {
  if (typeof state === "undefined") return initialState;

  const alert = asAlert(action.data);

  switch (action.type) {
    default:
      return state;
    case "SET_ALERT":
      if (alert) {
        return {
          ...state,
          alert: alert
        };
      }
      return state;
    case "HIDE_ALERT":
      return {
        ...state,
        alert: null
      };
  }
};
