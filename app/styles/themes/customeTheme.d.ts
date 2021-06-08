import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    breakPoints: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      mobile: number;
    };
    colors: {
      primary: string;
      secondary: string;
      border: string;

      text: string;
      textLight: string;
      textDark: string;

      // bootstrap colors
      success: string;
      info: string;
      warning: string;
      danger: string;
      light: string;
      dark: string;

      // gray-scale
      black: string;
      gray0: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      gray50: string;
      gray60: string;
      gray70: string;
      gray80: string;
      gray90: string;
      gray95: string;
      gray100: string;
      white: string;
    };
  }
}
