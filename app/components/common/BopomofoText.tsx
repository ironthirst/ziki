import React from "react";
import styled from "styled-components";

import { bopomofo } from "../../constants/bopomofo";

type Props = {
  text: string;
  orientation?: "vertical" | "horizontal";
  component?: any;
};

const Char = styled.ruby`
  // font-size: 3rem;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: 0.3rem;
  font-family: BopomofoPro, Muli;
  rt {
    font-size: 0.25em;
    text-align: center;
    margin-left: -0.2em;
    margin-right: 0.2em;
  }
`;

export function BopomofoText(props: Props) {
  const {
    text = "",
    orientation = "vertical",
    component: Component = Char,
  } = props;
  return (
    <div>
      {text.split("").map((c, i) => {
        const pinyin = bopomofo[c] ? bopomofo[c][0] : null;
        return (
          <Component key={i} className={orientation === "vertical" ? "v" : "h"}>
            {c}
            {pinyin ? <rt>{pinyin}</rt> : null}
          </Component>
        );
      })}
    </div>
  );
}
