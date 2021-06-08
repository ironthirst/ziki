import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { reducers } from "./reducers";
import { config } from "../config";

const composeEnhancers =
  (config.debug.redux.enabled &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  reducers,
  /* pre-loaded state, */
  composeEnhancers(applyMiddleware(thunk))
);
