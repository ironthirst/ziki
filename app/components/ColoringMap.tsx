import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GeoJSON from "geojson";
import { geoMercator, geoPath } from "d3-geo";

import { geoData } from "../constants/countries.geo";
import { ReduxState as RS } from "../rx";
import { PageWrapper } from "./common";

const CountryBorder = styled.path`
  fill: white;
  fill-opacity: 1;
  stroke: black;
  stroke-opacity: 1;
  cursor: pointer;
`;

type Props = {
  region:
    | "world"
    | "asia"
    | "north-america"
    | "south-america"
    | "africa"
    | "europe"
    | "oceania";
};

const regions: {
  [key: string]: {
    scale: number;
    translate: { x: number; y: number };
    countries: Set<string>;
    landscape: boolean;
  };
} = {
  asia: {
    landscape: true,
    scale: 3,
    translate: {
      x: -540,
      y: -300,
    },

    // prettier-ignore
    countries: new Set([
      "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CX", "CC", "IO",
      "GE", "HK", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG",
      "LA", "LB", "MO", "MY", "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS",
      "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TR", "TM",
      "AE", "UZ", "VN", "YE",
    ]),
  },
  "north-america": {
    landscape: false,
    scale: 1.7,
    translate: {
      x: -20,
      y: 50,
    },

    // prettier-ignore
    countries: new Set([
      "AI", "AG", "AW", "BS", "BB", "BZ", "BM", "BQ", "VG", "CA", "KY", "CR", 
      "CU", "CW", "DM", "DO", "SV", "GL", "GD", "GP", "GT", "HT", "HN", "JM", 
      "MQ", "MX", "PM", "MS", "CW", "KN", "NI", "PA", "PR", "BQ", "SX", "KN", 
      "LC", "PM", "VC", "TT", "TC", "US", "VI",
    ]),
  },
  "south-america": {
    landscape: false,
    scale: 3.7,
    translate: {
      x: -220,
      y: -420,
    },

    // prettier-ignore
    countries: new Set([
      "AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PY", "PE", "SR",
      "UY", "VE", "FRG",
    ]),
  },
  oceania: {
    landscape: true,
    scale: 4,
    translate: {
      x: -750,
      y: -470,
    },

    // prettier-ignore
    countries: new Set([
      "AS", "AU", "NZ", "CK", "TL", "FM", "FJ", "PF", "GU", "KI", "MP", "MH",
      "UM", "NR", "NC", "NU", "NF", "PW", "PG", "MP", "WS", "SB", "TK", "TO", 
      "TV", "VU", "UM", "WF",
    ]),
  },
  europe: {
    landscape: true,
    scale: 3.5,
    translate: {
      x: -390,
      y: -210,
    },

    // prettier-ignore
    countries: new Set([
      "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE",
      "GI", "GR", "HU", "IS", "IE", "IM", "IT", "RS", "LV", "LI", "LT", "LU",
      "MK", "MT", "MD", "MC", "ME", "NL", "NO", "PL", "PT", "RO", "SM", "RS",
      "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA", "RS", "RU",
    ]),
  },
  africa: {
    landscape: false,
    scale: 3.2,
    translate: {
      x: -410,
      y: -320,
    },

    // prettier-ignore
    countries: new Set([
      "DZ", "AO", "SH", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", 
      "CG", "CD", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", 
      "GW", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "YT", 
      "MA", "MZ", "NA", "NE", "NG", "ST", "RE", "RW", "ST", "SN", "SC", "SL", 
      "SO", "ZA", "SS", "SH", "SD", "SZ", "TZ", "TG", "TN", "UG", "CD", "ZM", 
      "TZ", "ZW",
    ]),
  },
};

export function ColoringMap(props: Props) {
  const { region: regionKey } = props;

  const region = regions[regionKey];
  const width = useSelector((s: RS) => s.site.viewPort.width);
  const landscape = region ? region.landscape : true;
  // adjust height to make sure it print within 1 page
  const height = landscape ? width / 1.5 : width * 1;

  // Build a path & a tooltip for each country
  const projection = geoMercator();
  const pathGenerator = geoPath().projection(projection);

  const pathData = geoData.features
    .filter((feature) => {
      // keep only the countries within the regions specified
      return region ? region.countries.has(feature.I) : true;
    })
    .map((feature) => {
      const geoFeature: GeoJSON.Feature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiPolygon",
          coordinates: feature.C,
        },
      };

      return pathGenerator(geoFeature);
    });

  const transforms = [
    `translate (${region?.translate.x || 0},${
      240 + (region?.translate.y || 0)
    })`,
    `scale(${(width / 1000) * (region?.scale || 1)})`,
  ];

  return (
    <PageWrapper landscape={landscape} portrait={!landscape}>
      <svg height={`${height}px`} width={`${width}px`}>
        <g transform={transforms.reverse().join(" ")}>
          {pathData.map((d, i) => (
            <CountryBorder key={`path_${i}`} d={d} />
          ))}
        </g>
      </svg>
    </PageWrapper>
  );
}
