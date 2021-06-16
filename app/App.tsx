import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import styled from "styled-components";
import qs from "querystring";

import { actions, ReduxState as RS } from "./rx";
import { Modal, Button, DropDown } from "./components/Manta";
import { PageLoadingSpinner } from "./components/Manta";

import { AdditionProblem } from "./components/AdditionProblem";
import {
  WorldMap,
  AsiaMap,
  AfricaMap,
  NorthAmericaMap,
  SouthAmericaMap,
  OceaniaMap,
  EuropeMap,
} from "./components/ColoringMap";
import { TaiwanMap } from "./components/TaiwanMap";
import { Bopomofo } from "./components/Bopomofo";
import { ChineseCharacter } from "./components/ChineseCharacter";
import { EnglishCharacter } from "./components/EnglishCharacter";
import { AdditionBingoBoard } from "./components/AdditionBingoBoard";

import { BattleDiceGame } from "./components/BattleDiceGame";
import { RoundTheMap } from "./components/RoundTheMapGame";
import { VisibleIf } from "./components/common/VisibleIf";

const AppWrapper = styled.div``;

const showGames = true;

export function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.site.installWindowHooks());
  }, []);

  const search = qs.parse(history.location.search.substr(1));
  const [currentMode, setCurrentMode] = useState(`${search["c"] || ""}`);

  return (
    <AppWrapper>
      <div
        className="p-2 d-print-none"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "90%",
          borderBottom: "1px solid #333",
        }}
      >
        <DropDown
          label="習題"
          options={[
            { label: "---", value: "" },
            { label: "長加法習題產生器", value: "addition" },
            { label: "注音符號練習表", value: "bopomofo" },
            { label: "中文筆順練習表", value: "chinese-characters" },
            { label: "英文筆順練習表", value: "english-characters" },
            { label: "加法賓果板", value: "addition-bingo" },
          ]}
          value={currentMode}
          onValueChanged={(s) => {
            if (!s) return;
            setCurrentMode(s);
            history.push(`${history.location.pathname}?c=${s}`);
          }}
        />
        <DropDown
          label="地圖"
          options={[
            { label: "---", value: "" },
            { label: "台灣縣市地圖", value: "taiwan-county-map" },
            { label: "世界地圖", value: "world-map" },
            { label: "亞洲地圖", value: "asia-map" },
            { label: "非洲地圖", value: "africa-map" },
            { label: "歐洲地圖", value: "europe-map" },
            { label: "北美洲地圖", value: "north-america-map" },
            { label: "南美洲地圖", value: "south-america-map" },
            { label: "大洋洲地圖", value: "oceania-map" },
          ]}
          value={currentMode}
          onValueChanged={(s) => {
            if (!s) return;
            setCurrentMode(s);
            history.push(`${history.location.pathname}?c=${s}`);
          }}
        />
        {!showGames ? null : (
          <DropDown
            label="遊戲"
            options={[
              { label: "---", value: "" },
              { label: "怪物大亂鬥", value: "battle-dice-game" },
              { label: "環遊台灣", value: "round-the-map" },
            ]}
            value={currentMode}
            onValueChanged={(s) => {
              if (!s) return;
              setCurrentMode(s);
              history.push(`${history.location.pathname}?c=${s}`);
            }}
          />
        )}
        <Button primary onClick={() => window.print()}>
          列印
        </Button>
      </div>

      <VisibleIf
        cond={currentMode === "addition"}
        component={AdditionProblem}
      />
      <VisibleIf cond={currentMode === "world-map"} component={WorldMap} />
      <VisibleIf cond={currentMode === "asia-map"} component={AsiaMap} />
      <VisibleIf
        cond={currentMode === "north-america-map"}
        component={NorthAmericaMap}
      />
      <VisibleIf
        cond={currentMode === "south-america-map"}
        component={SouthAmericaMap}
      />
      <VisibleIf cond={currentMode === "europe-map"} component={EuropeMap} />
      <VisibleIf cond={currentMode === "oceania-map"} component={OceaniaMap} />
      <VisibleIf cond={currentMode === "africa-map"} component={AfricaMap} />
      <VisibleIf
        cond={currentMode === "taiwan-county-map"}
        component={TaiwanMap}
      />

      <VisibleIf
        cond={currentMode === "taiwan-county-map"}
        component={TaiwanMap}
      />
      <VisibleIf cond={currentMode === "bopomofo"} component={Bopomofo} />
      <VisibleIf
        cond={currentMode === "chinese-characters"}
        component={ChineseCharacter}
      />
      <VisibleIf
        cond={currentMode === "english-characters"}
        component={EnglishCharacter}
      />
      <VisibleIf
        cond={currentMode === "battle-dice-game"}
        component={BattleDiceGame}
      />
      <VisibleIf
        cond={currentMode === "round-the-map"}
        component={RoundTheMap}
      />
      <VisibleIf
        cond={currentMode === "addition-bingo"}
        component={AdditionBingoBoard}
      />

      <SiteModal />
      <SiteSpinner />
    </AppWrapper>
  );
}

function SiteModal() {
  const modal = useSelector((state: RS) => state.modal);
  const dispatch = useDispatch();

  const content = modal.message
    ?.split("。")
    .filter((l) => l.trim().length)
    .map((l) => `<div>${l}。</div>`)
    .join("");

  return (
    <Modal
      id="site-modal"
      isOpen={modal.isOpen}
      onClose={() => dispatch(actions.modal.hideAlertModal)}
      title={modal.title}
      footer={
        <div>
          <Button
            primary
            onClick={() => dispatch(actions.modal.hideAlertModal())}
          >
            關閉
          </Button>
        </div>
      }
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Modal>
  );
}

function SiteSpinner() {
  const { isAppSpinnerVisible, appSpinnerMessage } = useSelector(
    (s: RS) => s.site
  );
  if (!isAppSpinnerVisible) return null;
  return <PageLoadingSpinner title={appSpinnerMessage || "請稍後"} />;
}
