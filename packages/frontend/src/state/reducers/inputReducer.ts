import { Reducer } from "react";
import { State, Action } from "../../types";
import { initialState } from "../rootReducer";
import tg from "../../utils/typeguards";

export const inputReducer: Reducer<State, Action> = (state, action) => {
  if (typeof state === "undefined") return initialState;


  switch (action.type) {
    default:
      return state;
    case "CLEAR_INPUT_NOTE":
      return {
        ...state,
        inputs: { ...state.inputs, newNote: "" }
      };
    case "SET_INPUT_NOTE":
      if (!tg.isString(action.data)) return state;
      return {
        ...state,
        inputs: { ...state.inputs, newNote: action.data }
      };
  }
};
