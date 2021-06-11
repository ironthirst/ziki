import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { geoPath } from "d3-geo";

import { geoData } from "../constants/taiwanCounties.geo";
import { ReduxState as RS } from "../rx";
import { PageWrapper } from "./common";

const CountryBorder = styled.path`
  stroke: black;
  fill: transparent;
  stroke-width: ${(props) => props.strokeWidth}px;
`;

export function TaiwanMap() {
  const width = useSelector((s: RS) => Math.min(s.site.viewPort.width, 1100));
  // adjust height to make sure it print within 1 page
  const height = width * 1.5;

  const pathGenerator = geoPath();

  const pathData = geoData.features.map((feature) =>
    pathGenerator(feature as any)
  );

  const scale = width / 2.88;

  // These are the transform to be applied; specified in the order to be
  // applied. However, when constructing the actual transform-list, browser
  // apply the transform last => first, so have to reverse the following
  // array before creating the final transform list.
  const transforms = [
    // our map is drawn without projection, so is in (lon,lat) coordinate space.
    // the following translate will center Taiwan at (0, 0). This is necessary
    // because scale transform has scale-origin set at (0, 0)
    `translate(-120.8502133, -23.546162)`,
    // scale up the map to make it fit nicely with the size of our canvas
    `scale(${scale})`,
    // screen coordinate has y-axis going down, so reverse it here
    `scale(1, -1)`,
    // move the map from (0, 0) to middle of the canvas
    `translate(${width / 2}, ${height / 2})`,
  ];

  return (
    <PageWrapper portrait>
      <svg height={`${height}px`} width={`${width}px`}>
        <g transform={transforms.reverse().join(" ")}>
          {pathData.map((d, i) => (
            <CountryBorder key={`path_${i}`} d={d} strokeWidth={2 / scale} />
          ))}
        </g>
      </svg>
    </PageWrapper>
  );
}
