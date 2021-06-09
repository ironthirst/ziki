import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { ReduxState as RS } from "../rx";
import { RadioGroup, DropDown, CheckBoxGroup } from "./Manta";
import { chunk, times } from "../lib/util";
import { config } from "../config";

const Wrapper = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  @media print {
    @page {
      size: landscape;
    }
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.4rem;
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
  "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ".split(
    ""
  );

export function Bopomofo() {
  const symbolsPerRow = 9;

  const screenWidth = useSelector((s: RS) => s.site.viewPort.width);
  const cellSize = screenWidth / symbolsPerRow;
  const isSmallScreen = useSelector((s: RS) => s.site.viewPort.isSmallScreen);
  const [selectedSymbols, setSelectedSymbols] = useState([...symbols]);
  const [practiceCount, setPracticeCount] = useState(4);

  const chunked = chunk(selectedSymbols, symbolsPerRow);

  console.log(chunked);
  return (
    <Wrapper>
      <Container
        className="py-4 d-print-none"
        style={{ flex: 1, borderBottom: `1px solid #333` }}
      >
        <Row>
          <Title className="py-4">注音符號習題產生器</Title>
        </Row>
        <Row>
          <div style={{ flex: 1 }}>
            <CheckBoxGroup
              label="練習符號"
              groupName="symbols"
              options={symbols.map((value) => ({ value }))}
              value={selectedSymbols}
              onValueChanged={setSelectedSymbols}
            />
          </div>
        </Row>
        <Row>
          <div style={{ flex: 1 }}>
            <RadioGroup
              label="練習次數"
              groupName="practice-count"
              options={times(4).map((n) => ({ value: `${n + 1}` }))}
              value={`${practiceCount}`}
              onValueChanged={(s) => setPracticeCount(parseInt(s))}
            />
          </div>
        </Row>
      </Container>
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
    </Wrapper>
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
