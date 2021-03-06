import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { ReduxState as RS } from "../rx";
import { RadioGroup, CheckBoxGroup, Button } from "./Manta";
import { chunk, times } from "../lib/util";
import { config } from "../config";
import { PageWrapper } from "./common";

const Title = styled.div`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.4rem;
  text-align: center;
`;

const Container = styled.div<{ breakAfter?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media print {
    ${(props) => (props.breakAfter ? "page-break-after: always;" : "")}
  }
  margin-bottom: 4rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Cell = styled.div<{
  size: number;
  showGrid?: boolean;
  bottomBorder?: boolean;
}>`
  max-width: ${(props) => `${props.size}px`};
  max-height: ${(props) => `${props.size}px`};
  width: 8rem;
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  @media (max-width: ${config.screenSizeBreakPoints.sm}px) {
    font-size: 2rem;
  }
  border: ${(props) => (props.showGrid ? 1 : 0)}px solid #ccc;
  margin-left: -1px;
  margin-bottom: -1px;
  ${(props) => (props.bottomBorder ? "border-bottom: 5px solid black;" : "")};
  font-weight: 500;
`;

const symbols =
  "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ".split(
    ""
  );
export function Bopomofo() {
  const symbolsPerRow = 8;

  const screenWidth = useSelector((s: RS) => s.site.viewPort.width);
  const cellSize = screenWidth / symbolsPerRow;
  const [selectedSymbols, setSelectedSymbols] = useState([...symbols]);
  const [practiceCount, setPracticeCount] = useState(4);

  const chunked = chunk(selectedSymbols, symbolsPerRow);

  return (
    <PageWrapper landscape>
      <div
        className="py-4 d-print-none"
        style={{ borderBottom: `1px solid #333` }}
      >
        <Title className="py-4">注音符號習題產生器</Title>
        <CheckBoxGroup
          label="練習符號"
          groupName="symbols"
          options={symbols.map((value) => ({ value }))}
          value={selectedSymbols}
          onValueChanged={setSelectedSymbols}
        />
        <div className="py-4">
          <Button
            secondary
            onClick={() => {
              setSelectedSymbols("ㄉㄊㄋㄍㄖㄏㄗㄛㄜㄟㄞㄠㄢㄝㄤㄦ".split(""));
            }}
          >
            選取易寫反符號
          </Button>
          &nbsp;
          <Button
            secondary
            onClick={() => {
              setSelectedSymbols([]);
            }}
          >
            重選
          </Button>
          &nbsp;
          <Button
            secondary
            onClick={() => {
              setSelectedSymbols(symbols);
            }}
          >
            全選
          </Button>
        </div>
        <RadioGroup
          label="練習次數"
          groupName="practice-count"
          options={times(4).map((n) => ({ value: `${n + 1}` }))}
          value={`${practiceCount}`}
          onValueChanged={(s) => setPracticeCount(parseInt(s))}
        />
      </div>
      {chunked.map((chunk, i) => (
        <Grid
          key={i}
          cellSize={cellSize}
          rows={practiceCount + 1}
          columns={symbolsPerRow}
          breakAfter
          getText={(row, col) => (row ? "" : chunk[col] || "")}
        />
      ))}
    </PageWrapper>
  );
}

function Grid(props: {
  rows: number;
  columns: number;
  cellSize: number;
  getText: (row: number, col: number) => string;
  breakAfter?: boolean;
}) {
  const { rows, columns, cellSize, getText, breakAfter } = props;

  return (
    <Container breakAfter={breakAfter}>
      {times(rows).map((row) => (
        <GridRow
          cellSize={cellSize}
          key={row}
          cells={columns}
          getText={(cell) => getText(row, cell)}
        />
      ))}
    </Container>
  );
}

function GridRow(props: {
  cells: number;
  cellSize: number;
  getText: (cell: number) => string;
}) {
  const { cells, cellSize, getText } = props;

  return (
    <Row>
      {times(cells).map((cell) => (
        <Cell key={cell} size={cellSize} showGrid>
          {getText(cell)}
        </Cell>
      ))}
    </Row>
  );
}
