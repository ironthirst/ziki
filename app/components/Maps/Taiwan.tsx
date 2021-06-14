import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { geoPath } from "d3-geo";

import { geoData } from "../../constants/taiwanCounties.geo";

const CountryBorder = styled.path`
  stroke: black;
  stroke-width: ${(props) => props.strokeWidth}px;
`;

type CountyName = string;

// function entry points

type Props = {
  width: number;
  height: number;
  counties?: CountyName[];
  getCountyFillColor?: (county: CountyName) => string;
  scale?: number;
};

export function Taiwan(props: Props) {
  const {
    width,
    height,
    counties,
    getCountyFillColor,
    scale: additionalScale = 1,
  } = props;
  const boardRef = useRef<HTMLDivElement>();

  const pathGenerator = geoPath();

  const pathData = geoData.features
    .filter((f) =>
      counties ? counties.includes(f.properties.COUNTYNAME) : true
    )
    .map((feature) => {
      const name = feature.properties.COUNTYNAME;
      return {
        d: pathGenerator(feature as any),
        name,
        fill: getCountyFillColor ? getCountyFillColor(name) : "transparent",
      };
    });

  const scale = (width / 2.88) * additionalScale;

  // These are the transform to be applied; specified in the order to be
  // applied. However, when constructing the actual transform-list, browser
  // apply the transform last => first, so have to reverse the following
  // array before creating the final transform list.
  const transforms = [
    // our map is drawn without projection, so is in (lon,lat) coordinate space.
    // the following translate will center Taiwan at (0, 0). This is necessary
    // because scale transform has scale-origin set at (0, 0)
    `translate(-120.8502133, -23.546162)`,
    // scale up the map to make it fit nicely with the size of our u
    `scale(${scale})`,
    // `rotate(90)`,
    // screen coordinate has y-axis going down, so reverse it here
    `scale(1, -1)`,
    // move the map from (0, 0) to middle of the canvas
    `translate(${width / 2}, ${height / 2})`,
  ];

  return (
    <svg height={`${height}px`} width={`${width}px`}>
      <g transform={transforms.reverse().join(" ")}>
        {pathData.map((p, i) => (
          <CountryBorder
            key={`path_${i}`}
            d={p.d}
            strokeWidth={2 / scale}
            fill={p.fill}
          />
        ))}
      </g>
    </svg>
  );
}
