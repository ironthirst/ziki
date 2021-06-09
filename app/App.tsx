import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { actions, ReduxState as RS } from "./rx";
import { Modal, Button, RadioGroup, DropDown } from "./components/Manta";
import { PageLoadingSpinner } from "./components/Manta";

import { AdditonProblem } from "./components/AdditionProblem";
import { ColoringMap } from "./components/ColoringMap";

const AppWrapper = styled.div``;

const NoPrint = styled.div`
  @media print {
    display: none !important;
  }
`;

export function App() {
  const [mode, setMode] = useState("world-map");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.site.installWindowHooks());
  }, []);

  return (
    <AppWrapper>
      <NoPrint>
        <div
          className="p-2"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            borderBottom: "1px solid #333",
          }}
        >
          <RadioGroup
            groupName="function-select"
            options={[
              { label: "長加法習題產生器", value: "addition" },
              { label: "世界地圖", value: "world-map" },
              { label: "亞洲地圖", value: "asia-map" },
              { label: "非洲地圖", value: "africa-map" },
              { label: "歐洲地圖", value: "europe-map" },
              { label: "北美洲地圖", value: "north-america-map" },
              { label: "南美洲地圖", value: "south-america-map" },
              { label: "大洋洲地圖", value: "oceania-map" },
            ]}
            value={mode}
            onValueChanged={setMode}
          />
          <Button primary onClick={() => window.print()}>
            列印
          </Button>
        </div>
      </NoPrint>

      {mode !== "addition" ? null : <AdditonProblem />}
      {mode !== "world-map" ? null : <ColoringMap region="world" />}
      {mode !== "asia-map" ? null : <ColoringMap region="asia" />}
      {mode !== "africa-map" ? null : <ColoringMap region="africa" />}
      {mode !== "europe-map" ? null : <ColoringMap region="europe" />}
      {mode !== "north-america-map" ? null : (
        <ColoringMap region="north-america" />
      )}
      {mode !== "south-america-map" ? null : (
        <ColoringMap region="south-america" />
      )}
      {mode !== "oceania-map" ? null : <ColoringMap region="oceania" />}

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
