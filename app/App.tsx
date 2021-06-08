import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { actions, ReduxState as RS } from "./rx";
import { Modal, Button } from "./components/Manta";
import { AdditonProblem } from "./components/AdditionProblem";
import { PageLoadingSpinner } from "./components/Manta";

const AppWrapper = styled.div``;

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.site.installWindowHooks());
  }, []);

  return (
    <AppWrapper>
      <AdditonProblem />;
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
