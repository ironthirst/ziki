import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { times } from "../lib/util";

// constants

const PAGE_MARGIN = 30;
const CELL_COUNT = 10;

// START style comonents

const Board = styled.div`
  position: relative;
  // border: 1px solid #333;
  padding: ${PAGE_MARGIN}px;
  // width: 29.7cm;
  // height: calc(21cm - 1px);
  width: 26.2cm;
  // height: calc(29.7cm - 1px);
  height: 37.1cm;
  margin-left: auto;
  margin-right: auto;

  -webkit-print-color-adjust: exact;

  @page {
    size: A4 portrait;
    // margin: 30mm 45mm 30mm 45mm;

    margin: 0;
  }
`;

const Cell = styled.div<{ size: number; background?: string }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: 2px solid black;
  margin-left: -2px;
  margin-top: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 2rem;
  background: ${(props) => props.background || "transparent"};
  color: ${(props) => (props.background ? "white" : "black")};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; ;
`;

// END styles components

// function entry points

export function AdditionBingoBoard() {
  const [cellSize, setCellSize] = useState(0);
  const boardRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const width = boardRef.current.clientWidth - PAGE_MARGIN * 2;
    setCellSize(Math.floor(width / CELL_COUNT));
  }, []);

  console.log(cellSize);
  return (
    <Board ref={boardRef}>
      {times(CELL_COUNT).map((r) => (
        <Row key={r}>
          {times(CELL_COUNT).map((c) => (
            <Cell
              key={c}
              size={cellSize}
              background={!c && !r ? null : !c ? "blue" : !r ? "red" : null}
            >
              {!c ? r : !r ? c : ""}
            </Cell>
          ))}
        </Row>
      ))}
    </Board>
  );
}
