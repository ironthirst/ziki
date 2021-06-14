import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { geoPath } from "d3-geo";
import { scaleSequential, scaleLinear } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";

import { geoData } from "../constants/taiwanCounties.geo";
import { times } from "../lib/util";
import { RadioGroup, BinaryRadioGroup } from "./Manta";
import { Taiwan, Taiwan as TaiwanMap } from "./Maps/Taiwan";

// constants

const PAGE_MARGIN = 30;

// START style comonents

const Title = styled.div`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.4rem;
  text-align: center;
`;

const Board = styled.div`
  position: relative;
  border: 1px solid #333;
  padding: ${PAGE_MARGIN}px;
  // width: 29.7cm;
  // height: calc(21cm - 1px);
  width: 26.2cm;
  // height: calc(29.7cm - 1px);
  height: 37.1cm;
  margin-left: auto;
  margin-right: auto;

  @page {
    size: A4 portrait;
    // margin: 30mm 45mm 30mm 45mm;

    margin: 0;
  }
`;

const Box = styled.div<{ size: number }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: 4px dashed #ccc;
  color: #ccc;
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.size / 3}px;
`;

// END styles components

// start one-time generated constants

const counties = [
  { name: "基隆市", weight: 1, prevWeight: 0, color: "black" },
  { name: "臺北市", weight: 1, prevWeight: 0, color: "black" },
  { name: "新北市", weight: 1, prevWeight: 0, color: "black" },
  { name: "宜蘭縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "花蓮縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "臺東縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "屏東縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "高雄市", weight: 1, prevWeight: 0, color: "black" },
  { name: "澎湖縣", weight: 0, prevWeight: 0, color: "black" },
  { name: "臺南市", weight: 1, prevWeight: 0, color: "black" },
  { name: "嘉義縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "嘉義市", weight: 0, prevWeight: 0, color: "black" },
  { name: "雲林縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "彰化縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "南投縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "臺中市", weight: 1, prevWeight: 0, color: "black" },
  { name: "苗栗縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "新竹市", weight: 0, prevWeight: 0, color: "black" },
  { name: "新竹縣", weight: 1, prevWeight: 0, color: "black" },
  { name: "桃園市", weight: 1, prevWeight: 0, color: "black" },
];

const totalWeight = counties.reduce((s, n) => s + n.weight, 0);
const colors = scaleSequential(interpolateRainbow);

let prevWeight = 0;
for (let i = 0; i < counties.length; i++) {
  const o = counties[i];
  const percentage = prevWeight / totalWeight;
  o.prevWeight = prevWeight;
  o.color = colors(percentage);
  prevWeight += o.weight;
}

// function entry points

export function RoundTheMap() {
  const [cellSize, setCellSize] = useState(100);
  const [colorize, setColorize] = useState(false);
  const [width, setWidth] = useState(2100);
  const [height, setHeight] = useState(0);
  const boardRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setWidth(boardRef.current.clientWidth - PAGE_MARGIN * 2);
    setHeight(boardRef.current.clientHeight - PAGE_MARGIN * 2);
  }, []);

  // given width and height, generate border boxes parameters
  const { gapX, gapY, boxesTemplate, minGap } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { gapX: 0, gapY: 0, rows: 0, columns: 0, boxesTemplate: [] };
    }

    const minGap = cellSize / 20;

    let rs = Math.floor(height / cellSize);
    // keep reduceing rows until we have a big enough gap
    while ((height - rs * cellSize) / (rs - 1) < minGap && rs) {
      rs--;
    }

    let cs = Math.floor(width / cellSize);
    // keep reduceing columns until we have a big enough gap
    while ((height - cs * cellSize) / (cs - 1) < minGap && cs) {
      cs--;
    }

    const gapX = (width - cellSize * cs) / (cs - 1);
    const gapY = (height - cellSize * rs) / (rs - 1);

    // boxes template is a border of boxes, starting from top-left
    // order is important.
    const boxesTemplate = [
      // top row, left to right
      ...times(cs).map((c) => ({ r: 0, c })),
      // right column, top to bottom
      ...times(rs - 2).map((r) => ({ r: r + 1, c: cs - 1 })),
      // bottom row, right to left
      ...times(cs)
        .reverse()
        .map((c) => ({ r: rs - 1, c })),
      // left column, bottom to top
      ...times(rs - 2)
        .reverse()
        .map((r) => ({ r: r + 1, c: 0 })),
    ];

    return { gapX, gapY, boxesTemplate, minGap };
  }, [width, height, cellSize]);

  const offset = 0;

  const boxes = [
    ...boxesTemplate.slice(offset),
    ...boxesTemplate.slice(0, offset),
  ];

  const indexScale = scaleLinear()
    .domain([0, boxes.length])
    .range([0, counties.length]);

  return (
    <>
      <div
        className="py-4 d-print-none mb-4"
        style={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          borderBottom: `1px solid #333`,
        }}
      >
        <Title className="py-4">環遊台灣</Title>
        <RadioGroup
          label="方格大小"
          groupName="cellSize"
          options={[
            { value: "50" },
            { value: "75" },
            { value: "100" },
            { value: "125" },
          ]}
          value={`${cellSize}`}
          onValueChanged={(s) => setCellSize(parseInt(s))}
        />
        <BinaryRadioGroup
          label="彩色地圖"
          groupName="colorize"
          value={colorize}
          onValueChanged={setColorize}
        />
      </div>
      <Board ref={boardRef}>
        <TaiwanMap
          width={width}
          height={height}
          scale={0.7}
          counties={counties.map((c) => c.name)}
          getCountyFillColor={(name) => {
            if (!colorize) return "transparent";
            return counties.find((c) => c.name === name).color;
          }}
        />
        {boxes.map((box, i) => {
          const left = `${box.c * (cellSize + gapX) + PAGE_MARGIN}px`;
          const top = `${box.r * (cellSize + gapY) + PAGE_MARGIN}px`;
          const color = colorize
            ? counties[Math.floor(indexScale(i))]?.color
            : "#aaa";
          return (
            <Box
              key={i}
              size={cellSize}
              style={{ left, top, borderColor: color, color }}
            >
              {!i ? "⇨" : i}
            </Box>
          );
        })}
      </Board>
    </>
  );
}
