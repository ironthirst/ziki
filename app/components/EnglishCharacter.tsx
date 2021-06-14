import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { ReduxState as RS } from "../rx";
import {
  CheckBoxGroup,
  TextInput,
  RadioGroup,
  Button,
  BinaryRadioGroup,
} from "./Manta";
import { times, chunk } from "../lib/util";
import { config } from "../config";

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

const symbols = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split("");

import { PageWrapper } from "./common";
import { Stroke } from "./Stroke";
export function EnglishCharacter() {
  const width = useSelector((s: RS) => s.site.viewPort.width);
  const [showGuideStroke, setShowGuideStroke] = useState(true);
  const [guideStrokeCount, setGuideStrokeCount] = useState(2);
  const [practiceText, setPracticeText] = useState(symbols.join(""));
  const [practiceCount, setPracticeCount] = useState(4);

  const symbolsPerRow = 8;
  const cellSize = width / symbolsPerRow;

  const chunked = chunk(practiceText.split(""), symbolsPerRow);

  return (
    <PageWrapper landscape>
      <div
        className="py-4 d-print-none"
        style={{ borderBottom: `1px solid #333` }}
      >
        <Title className="py-4">英文筆順習題產生器</Title>
        <TextInput
          label="練習字母"
          value={practiceText}
          onValueChanged={setPracticeText}
        />
        <div className="py-4">
          <Button secondary onClick={() => setPracticeText("")}>
            重置
          </Button>
          &nbsp;
          <Button
            secondary
            onClick={() =>
              setPracticeText(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
              )
            }
          >
            大小寫字母
          </Button>
          &nbsp;
          <Button
            secondary
            onClick={() => setPracticeText("ABCDEFGHIJKLMNOPQRSTUVWXYZ")}
          >
            大寫字母
          </Button>
          &nbsp;
          <Button
            secondary
            onClick={() => setPracticeText("abcdefghijklmnopqrstuvwxyz")}
          >
            小寫字母
          </Button>
        </div>
        <RadioGroup
          label="練習次數"
          groupName="practice-count"
          options={times(4).map((n) => ({ value: `${n + 1}` }))}
          value={`${practiceCount}`}
          onValueChanged={(s) => {
            const cnt = parseInt(s);
            setPracticeCount(cnt);
            setGuideStrokeCount(Math.min(cnt, guideStrokeCount));
          }}
        />
        <BinaryRadioGroup
          label="顯示 Guide"
          groupName="show-guide"
          value={showGuideStroke}
          onValueChanged={setShowGuideStroke}
        />
        <RadioGroup
          label="Guide 行數"
          options={times(practiceCount).map((n) => ({ value: `${n + 1}` }))}
          groupName="guide-count"
          value={`${guideStrokeCount}`}
          onValueChanged={(s) => setGuideStrokeCount(parseInt(s))}
        />
      </div>
      {chunked.map((chunk, i) => (
        <Grid
          key={i}
          cellSize={cellSize}
          rows={practiceCount + 1}
          columns={symbolsPerRow}
          breakAfter
          getNode={(row, col) =>
            chunk[col] ? (
              <Stroke
                char={chunk[col]}
                opacity={
                  !row
                    ? 1
                    : showGuideStroke && row <= guideStrokeCount
                    ? 0.1
                    : 0
                }
              />
            ) : (
              ""
            )
          }
        />
      ))}
    </PageWrapper>
  );
}

function Grid(props: {
  rows: number;
  columns: number;
  cellSize: number;
  getNode: (row: number, col: number) => React.ReactNode;
  breakAfter?: boolean;
}) {
  const { rows, columns, cellSize, getNode, breakAfter } = props;

  return (
    <Container breakAfter={breakAfter}>
      {times(rows).map((row) => (
        <GridRow
          cellSize={cellSize}
          key={row}
          cells={columns}
          getNode={(cell) => getNode(row, cell)}
        />
      ))}
    </Container>
  );
}

function GridRow(props: {
  cells: number;
  cellSize: number;
  getNode: (cell: number) => React.ReactNode;
}) {
  const { cells, cellSize, getNode } = props;

  return (
    <Row>
      {times(cells).map((cell) => (
        <Cell key={cell} size={cellSize} showGrid>
          {getNode(cell)}
        </Cell>
      ))}
    </Row>
  );
}
