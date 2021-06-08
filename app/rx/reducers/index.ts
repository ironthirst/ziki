import { combineReducers } from "redux";

import { site } from "./site";
import { modal } from "./modal";

export const reducers = combineReducers({
  site,
  modal,
});

export type ReduxState = ReturnType<typeof reducers>;
