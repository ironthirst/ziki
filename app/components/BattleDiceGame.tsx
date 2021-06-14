import React from "react";
import styled from "styled-components";

const Board = styled.div`
  border: 1px solid #333;
  width: 29.7cm;
  height: calc(21cm - 1px);
  margin-left: auto;
  margin-right: auto;

  @page {
    size: A4 landscape;
    margin: 0;
  }
`;

const DiceHolder = styled.div`
  width: 1.7cm;
  height: 1.7cm;
  border: 4px dashed #ccc;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MonsterHOlder = styled.div`
  border: 4px dashed #ccc;
  flex: 1;
  border-radius: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 2rem;
  letter-spacing: 0.5rem;
`;

const Hint = styled.div`
  color: #ccc;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  text-align: center;
`;

const GameRules = styled.div`
  color: #333;
  font-weight: 300;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  border-top: 2px solid #ccc;
`;

const Heart = styled.span`
  font-size: 1rem;
  color: red;
  :after {
    content: "♥";
  }
`;

export function BattleDiceGame() {
  return (
    <Board>
      <div className="d-flex flex-column h-100 p-4" style={{}}>
        <div className="d-flex flex-row" style={{ flex: 2 }}>
          <div className="d-flex flex-row" style={{ flex: 1 }}>
            <PlayerArea />
            <PlayerArea />
          </div>
        </div>
        <GameRules className="mt-4" style={{ paddingTop: "40px" }}>
          <div className="d-flex flex-row">
            <p style={{ flex: 1 }}>
              準備∶
              <br />
              1. 每位玩家選取你的怪物放在怪物區，並
              <br />
              2. 擲2個骰, 放在怪物的大弱點區
              <br />
              3. 擲2個骰, 放在怪物的小弱點區
              <br />
              4. 擲4個骰, 選最大的2個放在怪物的血量區 (小朋友可選3個骰)
              <br />
            </p>
            <p style={{ flex: 1 }}>
              規則∶
              <br />
              從小朋友先開始，兩人輸流擲3個骰
              <br />
              - 其中如有任2個骰加總等於對手的大弱點的加總，扣對方2點血
              <br />
              - 如有任2個骰加總等於對手的小弱點的加總，扣對方1點血
              <br />
              - 如可加總為對手的大弱點及小弱點，扣對方3點血
              <br />- 更新被攻擊的怪物的血量骰面
            </p>
          </div>
        </GameRules>
      </div>
    </Board>
  );
}

function PlayerArea() {
  return (
    <div className="d-flex flex-column" style={{ flex: 1 }}>
      <div
        className="d-flex flex-row align-items-stretch mx-4"
        style={{ flex: 1 }}
      >
        <div className="d-flex flex-column justify-content-center">
          <Hint>
            血量 <Heart />
          </Hint>
          <DiceHolder style={{ marginTop: "0.2cm" }} />
          <DiceHolder style={{ marginTop: "0.2cm" }} />
          <DiceHolder style={{ marginTop: "0.2cm" }} />
          <Hint>&nbsp;</Hint>
        </div>
        <div className="d-flex flex-column" style={{ flex: 1 }}>
          <MonsterHOlder className="m-4 h-100">怪物區</MonsterHOlder>
        </div>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-start my-2 pt-4">
        <DiceHolder style={{ marginLeft: "0.2cm" }} />
        <DiceHolder style={{ marginLeft: "0.2cm" }} />
        <Hint className="mx-4">
          大弱點 <Heart>-</Heart>
          <Heart />
        </Hint>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-start my-2">
        <DiceHolder style={{ marginLeft: "0.2cm" }} />
        <DiceHolder style={{ marginLeft: "0.2cm" }} />
        <Hint className="mx-4">
          小弱點 <Heart>-</Heart>
        </Hint>
      </div>
    </div>
  );
}
