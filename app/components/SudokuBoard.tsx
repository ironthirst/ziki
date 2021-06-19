import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { times } from "../lib/util";
import { BinaryRadioGroup, RadioGroup, Button } from "./Manta";

import { Sudoku } from "../lib/Sudoku";

const BW = 2;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.4rem;
  text-align: center;
`;

const GameGrid = styled.div<{ cellSize: number }>`
  position: relative;
  width: ${(props) => props.cellSize * 9 + BW * 4}px;
  height: ${(props) => props.cellSize * 9 + BW * 4}px;
  margin-left: auto;
  margin-right: auto;
  border-width: 32px solid black;
`;

const Cell = styled.div<{
  row: number;
  col: number;
  cellSize: number;
  isHint: boolean;
}>`
  position: absolute;
  width: ${(props) => props.cellSize}px;
  height: ${(props) => props.cellSize}px;
  left: ${(props) => (props.cellSize - BW) * props.col + BW}px;
  top: ${(props) => (props.cellSize - BW) * props.row + BW}px;
  border: ${BW}px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isHint ? "black" : "#ccc")};
  font-size: ${(props) => props.cellSize / 2}px;
`;

const SubGrid = styled.div<{ row: number; col: number; cellSize: number }>`
  position: absolute;
  width: ${(props) => props.cellSize * 3 - 1 * BW}px;
  height: ${(props) => props.cellSize * 3 - 1 * BW}px;
  left: ${(props) => (props.cellSize * 3 - 3 * BW) * props.col}px;
  top: ${(props) => (props.cellSize * 3 - 3 * BW) * props.row}px;
  border: ${BW * 2}px solid black;
`;

export function SudokuBoard() {
  const cellSize = 100;
  const [showAnswer, setShowAnswer] = useState(false);
  const [playOnline, setPlayOnline] = useState(false);
  const [game, setGame] = useState(null as Sudoku);
  const [answer, setAnswer] = useState(null as Sudoku);
  const [difficulty, setDifficulty] = useState(0);

  useEffect(() => {
    const game = Sudoku.create();
    setGame(game);
    const answer = game.solve();
    setAnswer(answer);
  }, [difficulty]);

  let givens = 0;
  if (game) {
    const cells = game.values;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (cells[r][c]) givens++;
      }
    }
  }

  // <BinaryRadioGroup
  //         label="線上遊玩"
  //         groupName="sudoku-play-online"
  //         value={playOnline}
  //         onValueChanged={setPlayOnline}
  //       />

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
        <Title className="py-4">數獨</Title>

        <RadioGroup
          label={`難度 (current hint#: ${givens})`}
          hint="數字愈小愈籣單"
          groupName="sudoku-difficulty"
          options={times(10).map((n) => ({ value: `${n * 2}` }))}
          value={`${difficulty}`}
          onValueChanged={(s) => setDifficulty(parseInt(s))}
        />
        {playOnline ? (
          <></>
        ) : (
          <>
            <BinaryRadioGroup
              label="顯示答案"
              groupName="sudoku-show-answer"
              value={showAnswer}
              onValueChanged={setShowAnswer}
            />
          </>
        )}

        <Button
          primary
          onClick={() => {
            const game = Sudoku.create(difficulty, 100);
            setGame(game);
            const answer = game.solve();
            setAnswer(answer);
          }}
        >
          重新產生新謎題
        </Button>
      </div>
      <GameGrid cellSize={cellSize}>
        {!game
          ? null
          : game.values.map((rows, row) => (
              <React.Fragment key={row}>
                {rows.map((hint, col) => (
                  <Cell
                    key={`${row}.${col}`}
                    cellSize={cellSize}
                    row={row}
                    col={col}
                    isHint={hint !== 0}
                  >
                    {hint ? hint : showAnswer ? answer.values[row][col] : ""}
                  </Cell>
                ))}
              </React.Fragment>
            ))}
        {times(9).map((n) => (
          <SubGrid
            key={n}
            cellSize={cellSize}
            row={n % 3}
            col={Math.floor(n / 3)}
          />
        ))}
      </GameGrid>
    </>
  );
}
