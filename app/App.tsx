import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import styled from "styled-components";

import { actions, ReduxState as RS } from "./rx";
import { Modal, Button, DropDown } from "./components/Manta";
import { PageLoadingSpinner } from "./components/Manta";

import { AdditonProblem } from "./components/AdditionProblem";
import { ColoringMap } from "./components/ColoringMap";
import { TaiwanMap } from "./components/TaiwanMap";
import { Bopomofo } from "./components/Bopomofo";
import { ChineseCharacter } from "./components/ChineseCharacter";
import { EnglishCharacter } from "./components/EnglishCharacter";

import { BattleDiceGame } from "./components/BattleDiceGame";
import { RoundTheMap } from "./components/RoundTheMapGame";

const AppWrapper = styled.div``;

const showGames = false;

export function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.site.installWindowHooks());
  }, []);

  const comps = history.location.pathname.split("/").filter((c) => c.length);
  const [currentMode, setCurrentMode] = useState(comps[comps.length - 1]);

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
          ]}
          value={currentMode}
          onValueChanged={(s) => {
            if (!s) return;
            setCurrentMode(s);
            history.push(`/${s}`);
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
            history.push(`/${s}`);
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
              history.push(`/${s}`);
            }}
          />
        )}
        <Button primary onClick={() => window.print()}>
          列印
        </Button>
      </div>

      <Route path="/addition" component={AdditonProblem} />
      <Route path="/world-map" render={() => <ColoringMap region="world" />} />
      <Route path="/asia-map" render={() => <ColoringMap region="asia" />} />
      <Route
        path="/africa-map"
        render={() => <ColoringMap region="africa" />}
      />

      <Route
        path="/europe-map"
        render={() => <ColoringMap region="europe" />}
      />
      <Route
        path="/north-america-map"
        render={() => <ColoringMap region="north-america" />}
      />
      <Route
        path="/south-america-map"
        render={() => <ColoringMap region="south-america" />}
      />
      <Route
        path="/oceania-map"
        render={() => <ColoringMap region="oceania" />}
      />

      <Route path="/taiwan-county-map" component={TaiwanMap} />
      <Route path="/bopomofo" component={Bopomofo} />
      <Route path="/chinese-characters" component={ChineseCharacter} />
      <Route path="/english-characters" component={EnglishCharacter} />
      <Route path="/battle-dice-game" component={BattleDiceGame} />
      <Route path="/round-the-map" component={RoundTheMap} />

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
