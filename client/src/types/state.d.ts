import { Reducer } from "react";

/**
 * Different options about how to render the app.
 */
export type AppMode = "DEFAULT" | "EASTER_EGG" | "LEAVE_NOTE";

/**
 * The form in which the state is to be saved to Redux store.
 */
export interface State {
  navbarVisible: boolean;
  appMode: AppMode;
}


/**
 * All possible options for action type concerning navbar visibility.
 */
export type ActionTypeNavbar = "TOGGLE_NAVBAR_VISIBILITY" | "SHOW_NAVBAR" | "HIDE_NAVBAR";

export interface Action {
  type: ActionTypeNavbar | AppMode;
  data?: unknown;
}

/**
 * The form in which `useSelector()` sees the Redux state; i. e. as combined from reducers.
 */
export interface StateCombinedFromReducers {
  navbarReducer: Reducer,
  appModeReducer: Reducer
}
