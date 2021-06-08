/*
  This is the main theme to be used by styled-component ThemeProvider.

  This is the normal theme to be used when not in holiday mode.
*/

import { DefaultTheme } from "styled-components";

const borderColor = "#e6e6e6";
const primaryColor = "#572d88";
const primaryColorDark = "#3E146F";

export const mainTheme: DefaultTheme = {
  colors: {
    primary: primaryColor,
    secondary: "#a88f6f",
    border: borderColor,

    text: "#333333",
    textDark: "#495057",
    textLight: "#eeeeee",

    // bootstrap colors
    success: "#28a745",
    info: "#17a2b8",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#f8f9fa",
    dark: "#343a40",

    // gray-scale
    black: "#000000",
    gray0: "#000000",
    gray10: "#1a1a1a",
    gray20: "#333333",
    gray30: "#4d4d4d",
    gray40: "#666666",
    gray50: "#7f7f7f",
    gray60: "#999999",
    gray70: "#b3b3b3",
    gray80: "#cccccc",
    gray90: "#e6e6e6",
    gray95: "#fcfcfc",
    gray100: "#ffffff",
    white: "#ffffff",
  },
  breakPoints: {
    xs: 575.98,
    sm: 767.98,
    md: 991.98,
    lg: 1119.98,
    mobile: 1119.98, // above this, use desktop layout
  },
};
