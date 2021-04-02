import { Reducer } from "react";
import { State, Action } from "../../types";
import { initialState } from "../rootReducer";

/**
 * Reducer responsible for switching between app modes (default or easter egg), and
 * tracking the easter egg specific state such as click counter.
 * @param state of the app
 * @param action that changes the state
 */
export const appModeReducer: Reducer<State, Action> = (state, action) => {
  if (typeof state === "undefined") return initialState;

  switch (action.type) {
    default:
      return state;
    case "INCR_COUNTER":
      return {
        ...state,
        eggClickCounter: state.eggClickCounter + 1
      };
    case "EASTER_EGG":
      return {
        ...state,
        appMode: "EASTER_EGG"
      };
  }
};
