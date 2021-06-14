import React from "react";

import UpperA from "svg-react-loader?name=UpperA!./assets/00041.svg";
import UpperB from "svg-react-loader?name=UpperB!./assets/00042.svg";
import UpperC from "svg-react-loader?name=UpperC!./assets/00043.svg";
import UpperD from "svg-react-loader?name=UpperD!./assets/00044.svg";
import UpperE from "svg-react-loader?name=UpperE!./assets/00045.svg";
import UpperF from "svg-react-loader?name=UpperF!./assets/00046.svg";
import UpperG from "svg-react-loader?name=UpperG!./assets/00047.svg";
import UpperH from "svg-react-loader?name=UpperH!./assets/00048.svg";
import UpperI from "svg-react-loader?name=UpperI!./assets/00049.svg";
import UpperJ from "svg-react-loader?name=UpperJ!./assets/0004a.svg";
import UpperK from "svg-react-loader?name=UpperK!./assets/0004b.svg";
import UpperL from "svg-react-loader?name=UpperL!./assets/0004c.svg";
import UpperM from "svg-react-loader?name=UpperM!./assets/0004d.svg";
import UpperN from "svg-react-loader?name=UpperN!./assets/0004e.svg";
import UpperO from "svg-react-loader?name=UpperO!./assets/0004f.svg";
import UpperP from "svg-react-loader?name=UpperP!./assets/00050.svg";
import UpperQ from "svg-react-loader?name=UpperQ!./assets/00051.svg";
import UpperR from "svg-react-loader?name=UpperR!./assets/00052.svg";
import UpperS from "svg-react-loader?name=UpperS!./assets/00053.svg";
import UpperT from "svg-react-loader?name=UpperT!./assets/00054.svg";
import UpperU from "svg-react-loader?name=UpperU!./assets/00055.svg";
import UpperV from "svg-react-loader?name=UpperV!./assets/00056.svg";
import UpperW from "svg-react-loader?name=UpperW!./assets/00057.svg";
import UpperX from "svg-react-loader?name=UpperX!./assets/00058.svg";
import UpperY from "svg-react-loader?name=UpperY!./assets/00059.svg";
import UpperZ from "svg-react-loader?name=UpperZ!./assets/0005a.svg";
import LowerA from "svg-react-loader?name=LowerA!./assets/00061.svg";
import LowerB from "svg-react-loader?name=LowerB!./assets/00062.svg";
import LowerC from "svg-react-loader?name=LowerC!./assets/00063.svg";
import LowerD from "svg-react-loader?name=LowerD!./assets/00064.svg";
import LowerE from "svg-react-loader?name=LowerE!./assets/00065.svg";
import LowerF from "svg-react-loader?name=LowerF!./assets/00066.svg";
import LowerG from "svg-react-loader?name=LowerG!./assets/00067.svg";
import LowerH from "svg-react-loader?name=LowerH!./assets/00068.svg";
import LowerI from "svg-react-loader?name=LowerI!./assets/00069.svg";
import LowerJ from "svg-react-loader?name=LowerJ!./assets/0006a.svg";
import LowerK from "svg-react-loader?name=LowerK!./assets/0006b.svg";
import LowerL from "svg-react-loader?name=LowerL!./assets/0006c.svg";
import LowerM from "svg-react-loader?name=LowerM!./assets/0006d.svg";
import LowerN from "svg-react-loader?name=LowerN!./assets/0006e.svg";
import LowerO from "svg-react-loader?name=LowerO!./assets/0006f.svg";
import LowerP from "svg-react-loader?name=LowerP!./assets/00070.svg";
import LowerQ from "svg-react-loader?name=LowerQ!./assets/00071.svg";
import LowerR from "svg-react-loader?name=LowerR!./assets/00072.svg";
import LowerS from "svg-react-loader?name=LowerS!./assets/00073.svg";
import LowerT from "svg-react-loader?name=LowerT!./assets/00074.svg";
import LowerU from "svg-react-loader?name=LowerU!./assets/00075.svg";
import LowerV from "svg-react-loader?name=LowerV!./assets/00076.svg";
import LowerW from "svg-react-loader?name=LowerW!./assets/00077.svg";
import LowerX from "svg-react-loader?name=LowerX!./assets/00078.svg";
import LowerY from "svg-react-loader?name=LowerY!./assets/00079.svg";
import LowerZ from "svg-react-loader?name=LowerZ!./assets/0007a.svg";
import Question from "svg-react-loader?name=UpperZ!./assets/0003f.svg";

const supportedCharacters = {
  A: UpperA,
  B: UpperB,
  C: UpperC,
  D: UpperD,
  E: UpperE,
  F: UpperF,
  G: UpperG,
  H: UpperH,
  I: UpperI,
  J: UpperJ,
  K: UpperK,
  L: UpperL,
  M: UpperM,
  N: UpperN,
  O: UpperO,
  P: UpperP,
  Q: UpperQ,
  R: UpperR,
  S: UpperS,
  T: UpperT,
  U: UpperU,
  V: UpperV,
  W: UpperW,
  X: UpperX,
  Y: UpperY,
  Z: UpperZ,
  a: LowerA,
  b: LowerB,
  c: LowerC,
  d: LowerD,
  e: LowerE,
  f: LowerF,
  g: LowerG,
  h: LowerH,
  i: LowerI,
  j: LowerJ,
  k: LowerK,
  l: LowerL,
  m: LowerM,
  n: LowerN,
  o: LowerO,
  p: LowerP,
  q: LowerQ,
  r: LowerR,
  s: LowerS,
  t: LowerT,
  u: LowerU,
  v: LowerV,
  w: LowerW,
  x: LowerX,
  y: LowerY,
  z: LowerZ,
};

type Props = {
  char: string;
  size?: number;
  opacity?: number;
};

export function Stroke(props: Props) {
  const { char, size = 109, opacity } = props;

  const Node = supportedCharacters[char] || Question;
  return <Node width={size} height={size} opacity={opacity} />;
}
