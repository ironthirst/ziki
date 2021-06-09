import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { geoPath } from "d3-geo";

import { geoData } from "../constants/taiwanCounties.geo";
import { ReduxState as RS } from "../rx";

const Wrapper = styled.div`
  height: auto;
  width: auto;
  padding: 0;
  margin: 0;
  transform: scaleY(-1);
  @media print {
    @page {
      size: portrait;
    }
  }
`;

const CountryBorder = styled.path<{
  fill: string;
  stroke: string;
  strokeWidth: number;
}>`
  fill: ${(props) => props.fill};
  fill-opacity: 1;
  stroke: ${(props) => props.stroke};
  stroke-opacity: 1;
  border-width: 0;
  stroke-width: ${(props) => props.strokeWidth}px;
`;

export function TaiwanMap() {
  const width = useSelector((s: RS) => Math.min(s.site.viewPort.width, 1100));
  // adjust height to make sure it print within 1 page
  const height = width * 1.5;

  const pathGenerator = geoPath();

  const pathData = geoData.features.map((feature) => {
    return { d: pathGenerator(feature as any) };
  });

  const scale = width / 2.88;

  return (
    <Wrapper>
      <svg height={`${height}px`} width={`${width}px`}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <g transform={`scale(${scale})`}>
            <g transform={`translate(-120.8502133, -23.546162)`}>
              {pathData.map((data, i) => (
                <CountryBorder
                  key={`path_${i}`}
                  d={data.d}
                  strokeWidth={2 / scale}
                  fill="transparent"
                  stroke="black"
                />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </Wrapper>
  );
}
