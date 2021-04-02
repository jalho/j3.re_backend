import { Reducer } from "react";

// own
import { State, Action } from "../../types";
import { initialState } from "../rootReducer";
import { asAuthPayload } from "../../utils/helpers";

export const authenticationReducer: Reducer<State, Action> = (state, action) => {
  if (typeof state === "undefined") return initialState;

  const authentication = asAuthPayload(action.data);

  switch (action.type) {
    case "SET_AUTHENTICATION":
      if (authentication) {
        return {
          ...state,
          authentication
        };
      } else return state;
    case "CLEAR_AUTHENTICATION":
      return {
        ...state,
        authentication: null
      };
    default:
      return state;
  }
};
