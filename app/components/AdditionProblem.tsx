import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { ReduxState as RS } from "../rx";
import { times } from "../lib/util";
import { DropDown, Button, BinaryRadioGroup, RadioGroup } from "./Manta";
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
  smallerFont?: boolean;
}>`
  max-width: ${(props) => `${props.size}px`};
  max-height: ${(props) => `${props.size}px`};
  width: 8rem;
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.smallerFont ? 2 : 3)}rem;
  border: ${(props) => (props.showGrid ? 1 : 0)}px solid #ccc;
  margin-left: -1px;
  margin-bottom: -1px;
  ${(props) => (props.bottomBorder ? "border-bottom: 5px solid black;" : "")};
`;

export function AdditionProblem() {
  const [numberOfDigits, setNumberOfDigits] = useState(10);
  const [numberOfProblems, setNumberOfProblems] = useState(3);
  // const [problemsPerPage, setProblemsPerPage] = useState(3);
  // const [showGrid, setShowGrid] = useState(true);
  const [minDigitValue, setMinDigitValue] = useState(2);
  const [allowCarry, setAllowCarry] = useState(false);
  const [nounce, setNounce] = useState(1);
  const screenWidth = useSelector((s: RS) => s.site.viewPort.width);
  const cellSize = screenWidth / (numberOfDigits + 1);
  const isSmallScreen = useSelector((s: RS) => s.site.viewPort.isSmallScreen);

  // constants that works well
  const problemsPerPage = 3;
  const showGrid = true;

  return (
    <PageWrapper>
      <div
        className="py-4 d-print-none"
        style={{ borderBottom: `1px solid #333` }}
      >
        <Title className="py-4">長加法習題產生器</Title>
        <DropDown
          style={{ flex: 1 }}
          label="題數"
          options={times(21).map((n) => ({
            label: `${n + 1}`,
            value: `${n + 1}`,
          }))}
          value={`${numberOfProblems}`}
          onValueChanged={(s) => setNumberOfProblems(parseInt(s))}
        />
        <RadioGroup
          groupName="number-of-digits"
          label="位數"
          options={times(10).map((n) => ({
            label: `${n + 1}`,
            value: `${n + 1}`,
          }))}
          value={`${numberOfDigits}`}
          onValueChanged={(s) => setNumberOfDigits(parseInt(s))}
        />
        <RadioGroup
          groupName="min-digit-value"
          label="最低 Digit 值"
          options={times(allowCarry ? 9 : 4).map((n) => ({
            label: `${n + 1}`,
            value: `${n + 1}`,
          }))}
          value={`${minDigitValue}`}
          onValueChanged={(s) => setMinDigitValue(parseInt(s))}
        />
        <BinaryRadioGroup
          groupName="radio-carry-over"
          label="包含進位?"
          value={allowCarry}
          onValueChanged={(b) => {
            setMinDigitValue(Math.min(minDigitValue, 4));
            setAllowCarry(b);
          }}
        />
        <div>
          <Button secondary onClick={() => setNounce(nounce + 1)}>
            重新產生題目
          </Button>
        </div>
      </div>
      {times(numberOfProblems).map((n) => (
        <div key={n}>
          <Container>
            <Row>
              <Cell size={cellSize} smallerFont={isSmallScreen}>
                P{n + 1}
              </Cell>
              {times(numberOfDigits).map((n) => (
                <Cell key={n} size={cellSize} />
              ))}
            </Row>
          </Container>
          <ProblemGrid breakAfter={(n + 1) % problemsPerPage === 0} />
        </div>
      ))}
    </PageWrapper>
  );

  function ProblemGrid(props: { breakAfter?: boolean }) {
    const { breakAfter } = props;
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    useEffect(() => {
      let n1 = 0;
      let n2 = 0;
      let finger = numberOfDigits;
      const generatedDigits = new Set();
      let attempts = 0;
      while (finger > 0) {
        let n = 0;
        // generate a possible sum
        while (n < minDigitValue * 2) {
          // with carry, max possible number is 18 (9 + 9)
          // without carry, max possible number is 9 (5 + 4)
          // generate a number at least 3, to the max possible number
          // to avoid trivial addition as 1+1
          n = Math.floor(Math.random() * (allowCarry ? 16 : 7)) + 3;
        }

        // partition the sum into two parts
        let d1 = 0;
        let d2 = n - d1;
        while (
          d1 < minDigitValue ||
          d1 >= 10 ||
          d2 < minDigitValue ||
          d2 >= 10
        ) {
          d1 = Math.floor(Math.random() * (n - 2)) + 1;
          d2 = n - d1;
        }

        // best effort attemps to minimize repetition
        if (generatedDigits.has(`${d1}.${d2}`)) {
          attempts++;
          // try again if not collide too many times
          if (attempts < 5) continue;
        }
        attempts = 0;

        generatedDigits.add(`${d1}.${d2}`);

        n1 = n1 * 10 + d1;
        n2 = n2 * 10 + d2;
        finger--;
      }
      setNumber1(n1);
      setNumber2(n2);
    }, [numberOfDigits]);

    return (
      <Container breakAfter={breakAfter} className="mb-4">
        <RowOfCells number={number1} />
        <RowOfCells number={number2} withAddSign />
        <RowOfCells />
      </Container>
    );
  }

  function RowOfCells(props: { number?: number; withAddSign?: boolean }) {
    const { number, withAddSign } = props;
    const digits = [];
    if (number) {
      let finger = number;
      while (finger) {
        digits.push(finger % 10);
        finger = Math.floor(finger / 10);
      }
    }
    const revDigits = digits.reverse();

    return (
      <Row>
        <Cell
          size={cellSize}
          showGrid={showGrid}
          bottomBorder={withAddSign}
          smallerFont={isSmallScreen}
        >
          {withAddSign ? "+" : ""}
        </Cell>
        {times(numberOfDigits).map((i) => (
          <Cell
            key={i}
            size={cellSize}
            showGrid={showGrid}
            bottomBorder={withAddSign}
            smallerFont={isSmallScreen}
          >
            {number ? revDigits[i] : ""}
          </Cell>
        ))}
      </Row>
    );
  }
}
