import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { times } from "../lib/util";
import { RadioGroup, DropDown } from "./Manta";

// constants

const PAGE_MARGIN = 30;
const BW = 1; // boarder

// START style comonents

const Title = styled.div`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.4rem;
  text-align: center;
`;

const Page = styled.div`
  position: relative;
  display: flex;
  //border: 1px solid #333;
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

const Cell = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: ${BW}px solid black;
  margin-left: ${-BW}px;
  margin-top: ${-BW}px;
  flex-grow: 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; ;
`;

export function GridMaker() {
  const boardRef = useRef<HTMLDivElement>();
  const [cellSize, setCellSize] = useState(100);
  const [width, setWidth] = useState(0);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);

  useEffect(() => {
    setWidth(boardRef.current.clientWidth - PAGE_MARGIN * 2);
  }, [boardRef]);

  return (
    <>
      <div
        className="py-4 d-print-none"
        style={{
          borderBottom: `1px solid #333`,
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Title className="py-4">表格產生器</Title>
        <DropDown
          label="行數"
          options={times(10).map((n) => ({ value: `${n + 5}` }))}
          value={`${rows}`}
          onValueChanged={(s) => setRows(parseInt(s))}
        />
        <DropDown
          label="列數"
          options={times(10).map((n) => ({ value: `${n + 5}` }))}
          value={`${cols}`}
          onValueChanged={(s) => setCols(parseInt(s))}
        />
        <DropDown
          label="方格大小"
          options={times(10).map((n) => ({ value: `${(n + 5) * 10}` }))}
          value={`${cellSize}`}
          onValueChanged={(s) => setCellSize(parseInt(s))}
        />
      </div>
      <Page ref={boardRef} className="d-flex flex-column">
        {times(rows).map((row) => {
          return (
            <Row>
              {times(cols).map((col) => {
                return <Cell key={col} size={cellSize} />;
              })}
            </Row>
          );
        })}
      </Page>
    </>
  );
}
