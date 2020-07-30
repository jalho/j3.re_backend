import { combineReducers } from "redux";

import { State } from "../types";
import { navbarReducer } from "./reducers/navbarReducer";
import { appModeReducer } from "./reducers/appModeReducer";
import { tokenReducer } from "./reducers/tokenReducer";
import { authenticationReducer } from "./reducers/authenticationReducer";

export const initialState: State = {
  navbarVisible: true,
  appMode: "DEFAULT",
  authentication: null
};

const rootReducer = combineReducers({
  navbarReducer,
  appModeReducer,
  tokenReducer,
  authenticationReducer
});

export default rootReducer;
