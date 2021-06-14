import React from "react";
import { useSelector } from "react-redux";

import { ReduxState as RS } from "../rx";
import { PageWrapper } from "./common";

import { Taiwan } from "./Maps/Taiwan";

export function TaiwanMap() {
  const width = useSelector((s: RS) => Math.min(s.site.viewPort.width, 1100));
  // adjust height to make sure it print within 1 page
  const height = width * 1.5;

  return (
    <PageWrapper portrait>
      <Taiwan width={width} height={height} />
    </PageWrapper>
  );
}
