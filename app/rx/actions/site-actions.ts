// import _ from "lodash";

// const { debounce } = _;

import { debounce } from "../../lib/util";

export const BOOTSTRAPPED = "BOOTSTRAPPED";
export const VIEW_PORT_UPDATED = "VIEW_PORT_UPDATED";
export const SHOW_APP_SPINNER = "SHOW_APP_SPINNER";
export const SHOW_LOGIN_MODAL = "SHOW_LOGIN_MODAL";

export const SiteActions = {
  installWindowHooks() {
    return async (dispatch: any) => {
      // view port size detection support
      window.addEventListener("scroll", () => {
        debounce(
          () =>
            dispatch({
              type: VIEW_PORT_UPDATED,
              scrollX: window.scrollX,
              scrollY: window.scrollY,
            }),
          200,
          "window-scroll"
        );
      }); // debounce 200ms to avoid excessive update

      window.addEventListener("resize", () => {
        debounce(
          () =>
            dispatch({
              type: VIEW_PORT_UPDATED,
              width: window.innerWidth,
              height: window.innerHeight,
            }),
          200,
          "window-resize"
        );
      }); // debounce 200ms to avoid excessive update

      // set initial size
      dispatch({
        type: VIEW_PORT_UPDATED,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
  },
  startPageLoading(message?: string) {
    return { type: SHOW_APP_SPINNER, isVisible: true, message };
  },
  stopPageLoading() {
    return { type: SHOW_APP_SPINNER, isVisible: false, message: "" };
  },
  viewportResized({ width, height }) {
    return { type: VIEW_PORT_UPDATED, width, height };
  },
};
