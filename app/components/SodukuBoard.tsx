import React, { useEffect } from "react";
import styled from "styled-components";
import { times, chunk, shuffle } from "../lib/util";

const BW = 2;

const allDigits: Given[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class Sudoku {
  private static allDigits: Given[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  private cells: Given[][];
  private constructor(game?: Sudoku) {
    this.cells = times(9).map((r) =>
      game ? [...game.cells[r]] : new Array(9).fill(0)
    );
  }

  public get unsolvable() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.cells[r][c]) continue;
        if (Sudoku.allDigits.every((d) => !this.canPlaceDigit(r, c, d))) {
          return true;
        }
      }
    }
    return false;
  }

  private canPlaceDigit(row: number, col: number, digit: number) {
    const baseRow = row - (row % 3);
    const baseCol = col - (col % 3);
    for (let i = 0; i < 9; i++) {
      if (this.cells[row][i] === digit) return false;
      if (this.cells[i][col] === digit) return false;
      if (this.cells[baseRow + Math.floor(i / 3)][baseCol + (i % 3)] === digit)
        return false;
    }
    return true;
  }

  private fillTrivialAnswers() {
    let filled = 0;
    do {
      filled = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.cells[r][c]) continue; // skip filled answer
          const choices = Sudoku.allDigits.filter((d) =>
            this.canPlaceDigit(r, c, d)
          );
          if (choices.length === 1) {
            filled++;
            this.cells[r][c] = choices[0];
          }
        }
      }
    } while (filled);
  }

  private scoreDigit(row: number, col: number, digit: number) {
    const baseRow = row - (row % 3);
    const baseCol = col - (col % 3);
    let score = 0;
    for (let i = 0; i < 9; i++) {
      if (this.cells[row][i] === digit) score++;
      if (this.cells[i][col] === digit) score++;
      if (this.cells[baseRow + Math.floor(i / 3)][baseCol + (i % 3)] === digit)
        score++;
    }
    return score;
  }

  private chooseEmptyPosition() {
    // chooose empty position that affect the maximum amount of cells
    let score = 0;
    const choices = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.cells[row][col]) continue;
        const newScore = Sudoku.allDigits
          .map((d) => this.scoreDigit(row, col, d))
          .reduce((s, v) => s + v);
        if (newScore < score) continue;
        if (newScore > score) {
          score = newScore;
          choices.length = 0; // this clear array
        }
        choices.push({ row, col });
      }
    }
    const choice = choices[Math.floor(Math.random() * choices.length)];
    const digits = Sudoku.allDigits.filter((d) =>
      this.canPlaceDigit(choice.row, choice.col, d)
    );
    return {
      row: choice.row,
      col: choice.col,
      digits,
    };
  }

  private solveGameRecurse(depth: number) {
    let solved = depth === 0;
    if (solved) return true;
    if (this.unsolvable) return false;

    // game not solved, find first empty space to recurse trying for number
    const { row, col, digits } = this.chooseEmptyPosition();
    // console.log(depth, "chosen", row, col, digits);

    // found an empty space, try all digit, and recurse
    for (let k = 0; k < digits.length && !solved; k++) {
      const digit = digits[k];
      // console.log(" ", depth, "set", digit, "from", digits);
      this.cells[row][col] = digit;
      // printGame(game);
      solved = this.solveGameRecurse(depth - 1);
      if (!solved) {
        this.cells[row][col] = 0; // reset answer
      } else {
        return true; // solved, preempt
      }
    }
    return false;
  }

  public solve(): Sudoku {
    const answer = new Sudoku(this);
    if (answer.unsolvable) return answer;

    // fill game with trivial answers before start with back-tracking
    answer.fillTrivialAnswers();

    let targetDepth = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (answer.cells[r][c] === 0) targetDepth++;
      }
    }
    answer.solveGameRecurse(targetDepth);
    return answer;
  }

  public get values() {
    const copy = new Sudoku(this);
    return copy.cells;
  }

  static create(hardness: number, tries?: number) {
    hardness = Math.min(Math.max(hardness, 0), 10);
    const game = new Sudoku();
    const answer = game.solve();
    if (!tries) tries = 100;

    hardness = Math.max(Math.min(20, hardness), 0);

    let answerRemoved = 0;
    let target: Sudoku = null;
    let hardestScore = 0;
    let hardestGame: Sudoku = null;
    do {
      target = new Sudoku(answer);
      answerRemoved = 0;
      // with answer, start removing cells until we no longer have a unique answer
      let r = 0;
      let c = 0;
      let given: Given = 0;
      do {
        r = Math.floor(Math.random() * 9);
        c = Math.floor(Math.random() * 9);
        given = target.cells[r][c];
        if (!given) continue;
        target.cells[r][c] = 0;
        answerRemoved++;
      } while (target.countSolutions(2) === 1);
      target.cells[r][c] = given;
      answerRemoved--;

      if (answerRemoved > hardestScore) {
        hardestScore = answerRemoved;
        hardestGame = new Sudoku(target);
      }

      tries--;
    } while (answerRemoved < 40 + hardness && tries);
    return hardestGame;
  }

  public countSolutions(max?: number) {
    const copy = new Sudoku(this);
    let targetDepth = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (copy.cells[r][c] === 0) targetDepth++;
      }
    }
    return copy.countSolutionsRecursive(targetDepth, max);
  }

  private countSolutionsRecursive(depth: number, max: number) {
    const solved = depth === 0;
    if (solved) return 1;
    if (this.unsolvable) return 0;

    // game not solved, find first empty space to recurse trying for number
    const { row, col, digits } = this.chooseEmptyPosition();
    // console.log(depth, "chosen", row, col, digits);

    // found an empty space, try all digit, and recurse
    let sum = 0;
    for (let k = 0; k < digits.length && !solved; k++) {
      const digit = digits[k];
      this.cells[row][col] = digit;
      // printGame(game);
      const count = this.countSolutionsRecursive(depth - 1, max);
      this.cells[row][col] = 0; // reset answer
      sum += count;
      if (sum >= max) return max; // preempt, max reached
    }
    return sum;
  }
}

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

type Given = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Game = Given[][];

function scoreDigit(game: Game, row: number, col: number, digit: number) {
  const baseRow = row - (row % 3);
  const baseCol = col - (col % 3);
  let score = 0;
  for (let i = 0; i < 9; i++) {
    if (game[row][i] === digit) score++;
    if (game[i][col] === digit) score++;
    if (game[baseRow + Math.floor(i / 3)][baseCol + (i % 3)] === digit) score++;
  }
  return score;
}

function countSolutions(game: Game, max: number) {
  const answer = copyGame(game);
  let targetDepth = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (answer[r][c] === 0) targetDepth++;
    }
  }
  return countSolutionsRecursive(answer, targetDepth, max);
}

function countSolutionsRecursive(game: Game, depth: number, max: number) {
  const solved = depth === 0;
  if (solved) return 1;
  if (unsolvable(game)) return 0;

  // game not solved, find first empty space to recurse trying for number
  const { row, col, digits } = chooseEmptyPosition(game);
  // console.log(depth, "chosen", row, col, digits);

  // found an empty space, try all digit, and recurse
  let sum = 0;
  for (let k = 0; k < digits.length && !solved; k++) {
    const digit = digits[k];
    game[row][col] = digit;
    // printGame(game);
    const count = countSolutionsRecursive(game, depth - 1, max);
    game[row][col] = 0; // reset answer
    sum += count;
    if (sum >= max) return max; // preempt, max reached
  }
  return sum;
}

function chooseEmptyPosition(
  game: Game
): { row: number; col: number; digits: Given[] } | null {
  // chooose empty position that affect the maximum amount of cells
  let score = 0;
  const choices = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (game[row][col]) continue;
      const newScore = allDigits
        .map((d) => scoreDigit(game, row, col, d))
        .reduce((s, v) => s + v);
      if (newScore < score) continue;
      if (newScore > score) {
        score = newScore;
        choices.length = 0; // this clear array
      }
      choices.push({ row, col });
    }
  }
  const choice = choices[Math.floor(Math.random() * choices.length)];
  const digits = allDigits.filter((d) =>
    canPlaceDigit(game, choice.row, choice.col, d)
  );
  return {
    row: choice.row,
    col: choice.col,
    digits,
  };
}

function canPlaceDigit(game: Game, row: number, col: number, digit: number) {
  const baseRow = row - (row % 3);
  const baseCol = col - (col % 3);
  for (let i = 0; i < 9; i++) {
    if (game[row][i] === digit) return false;
    if (game[i][col] === digit) return false;
    if (game[baseRow + Math.floor(i / 3)][baseCol + (i % 3)] === digit)
      return false;
  }
  return true;
}

function unsolvable(game: Game) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (game[r][c]) continue;
      if (allDigits.every((d) => !canPlaceDigit(game, r, c, d))) {
        // console.log("unsolvable at ", r, c);
        return true;
      }
    }
  }
  return false;
}

function fillTrivialAnswers(game: Game) {
  let filled = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (game[r][c]) continue; // skip filled answer
      const choices = allDigits.filter((d) => {
        return canPlaceDigit(game, r, c, d);
      });
      if (choices.length === 1) {
        filled++;
        game[r][c] = choices[0];
      }
    }
  }
  return filled;
}

function solveGame(game: Game) {
  if (unsolvable(game)) return game;
  const answer: Game = copyGame(game);

  // fill game with trivial answers before start with back-tracking
  let cellsFilled = 0;
  do {
    cellsFilled = fillTrivialAnswers(answer);
  } while (cellsFilled);

  let targetDepth = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (answer[r][c] === 0) targetDepth++;
    }
  }
  solveGameRecurse(answer, targetDepth);
  return answer;
}

function copyGame(game: Game) {
  return times(9).map((row) => times(9).map((col) => game[row][col]));
}

function solveGameRecurse(game: Game, depth: number) {
  let solved = depth === 0;
  if (solved) return true;
  if (unsolvable(game)) {
    // console.log(depth, "unsolvable");
    return false;
  }

  // game not solved, find first empty space to recurse trying for number
  const { row, col, digits } = chooseEmptyPosition(game);
  // console.log(depth, "chosen", row, col, digits);

  // found an empty space, try all digit, and recurse
  for (let k = 0; k < digits.length && !solved; k++) {
    const digit = digits[k];
    // console.log(" ", depth, "set", digit, "from", digits);
    game[row][col] = digit;
    // printGame(game);
    solved = solveGameRecurse(game, depth - 1);
    if (!solved) {
      game[row][col] = 0; // reset answer
    } else {
      return true; // solved, preempt
    }
  }
  return false;
}

function generateGame(hardness: number, tries: number) {
  const game = times(9).map((r) => new Array(9).fill(0));
  const answer = solveGame(game);

  hardness = Math.max(Math.min(20, hardness), 0);

  let answerRemoved = 0;
  let target = null;
  let hardestScore = 0;
  let hardestGame = null;
  do {
    target = copyGame(answer);
    answerRemoved = 0;
    // with answer, start removing cells until we no longer have a unique answer
    let r = 0;
    let c = 0;
    let given: Given = 0;
    do {
      r = Math.floor(Math.random() * 9);
      c = Math.floor(Math.random() * 9);
      given = target[r][c];
      if (!given) continue;
      target[r][c] = 0;
      answerRemoved++;
    } while (countSolutions(target, 2) === 1);
    target[r][c] = given;
    answerRemoved--;

    if (answerRemoved > hardestScore) {
      hardestScore = answerRemoved;
      hardestGame = copyGame(target);
    }

    tries--;
  } while (answerRemoved < 40 + hardness && tries);
  return hardestGame as Game;
}

export function SodukuBoard() {
  const cellSize = 100;
  const game = generateGame(0, 200);
  const answer = solveGame(game);

  return (
    <GameGrid cellSize={cellSize}>
      {game.map((rows, row) => (
        <React.Fragment key={row}>
          {rows.map((hint, col) => (
            <Cell
              key={`${row}.${col}`}
              cellSize={cellSize}
              row={row}
              col={col}
              isHint={hint !== 0}
            >
              {hint ? hint : ""}
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
  );
}
