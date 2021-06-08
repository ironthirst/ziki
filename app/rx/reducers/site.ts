import {
  VIEW_PORT_UPDATED,
  SHOW_APP_SPINNER,
  BOOTSTRAPPED,
} from "../actions/site-actions";

import { config } from "../../config";

const { screenSizeBreakPoints } = config;

export type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SiteReduxState = typeof initialState;

const initialState = {
  bootstrapped: false,
  isAppSpinnerVisible: false, // whether spinner is visible
  appSpinnerMessage: "",
  viewPort: {
    screenSize: "xs" as ScreenSize,
    scrollX: 0,
    scrollY: 0,
    width: 0,
    height: 0,
    isSmallScreen: true,
  },
};

export const site = (state = initialState, action: any): SiteReduxState => {
  switch (action.type) {
    case BOOTSTRAPPED:
      return { ...state, bootstrapped: true, ...action.payload };
    case VIEW_PORT_UPDATED: {
      const width = action.width || state.viewPort.width;
      let screenSize: ScreenSize = "xl";
      if (width < screenSizeBreakPoints.xs) {
        screenSize = "xs";
      } else if (width < screenSizeBreakPoints.sm) {
        screenSize = "sm";
      } else if (width < screenSizeBreakPoints.md) {
        screenSize = "md";
      } else if (width < screenSizeBreakPoints.lg) {
        screenSize = "lg";
      }

      let blockCount = 2;
      switch (screenSize) {
        case "xs":
          blockCount = 2;
          break;
        case "sm":
          blockCount = 3;
          break;
        case "md":
          blockCount = 4;
          break;
        default:
          blockCount = 5;
          break;
      }

      return {
        ...state,
        viewPort: {
          ...state.viewPort,
          scrollX: Number.isInteger(action.scrollX)
            ? action.scrollX
            : state.viewPort.scrollX,
          scrollY: Number.isInteger(action.scrollY)
            ? action.scrollY
            : state.viewPort.scrollY,
          width: action.width || state.viewPort.width,
          height: action.height || state.viewPort.height,
          screenSize,
          isSmallScreen:
            screenSize === "xs" || screenSize === "sm" || screenSize === "md",
        },
      };
    }
    case SHOW_APP_SPINNER:
      return {
        ...state,
        isAppSpinnerVisible: action.isVisible,
        appSpinnerMessage: action.message,
      };
    default:
      return state;
  }
};
