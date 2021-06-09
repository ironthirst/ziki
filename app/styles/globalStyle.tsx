import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Noto Sans TC';      /* 同樣的 font-family */
    unicode-range: U+3100-312F;     /* Bopomofo */
    src: local(LiHei Pro),          /* OS X */
    local("微軟正黑體"); /* Windows Vista+ */
  }
`;
