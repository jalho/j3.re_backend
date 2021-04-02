import { combineReducers } from "redux";

import { State } from "../types";
import { navbarReducer } from "./reducers/navbarReducer";
import { appModeReducer } from "./reducers/appModeReducer";
import { authenticationReducer } from "./reducers/authenticationReducer";
import { alertReducer } from "./reducers/alertReducer";
import { inputReducer } from "./reducers/inputReducer";

export const initialState: State = {
  navbarVisible: true,
  appMode: "DEFAULT",
  authentication: null,
  alert: null,
  eggClickCounter: 0,
  inputs: { newNote: "" }
};

const rootReducer = combineReducers({
  navbarReducer,
  appModeReducer,
  authenticationReducer,
  alertReducer,
  inputReducer
});

export default rootReducer;
