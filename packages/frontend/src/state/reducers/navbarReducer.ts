import { Reducer } from "react";
import { State, Action } from "../../types";
import { initialState } from "../rootReducer";

export const navbarReducer: Reducer<State, Action> = (state, action) => {
  if (typeof state === "undefined") return initialState;

  switch (action.type) {
    case "TOGGLE_NAVBAR_VISIBILITY":
      return {
        ...state,
        navbarVisible: !state.navbarVisible
      };
    case "HIDE_NAVBAR": 
      return {
        ...state,
        navbarVisible: false
      };
    case "SHOW_NAVBAR":
      return {
        ...state,
        navbarVisible: true
      };
    default:
      return state;
  }
};
