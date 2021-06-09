import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GeoJSON from "geojson";
import { geoMercator, geoPath } from "d3-geo";

import { geoData } from "../constants/countries.geo";
import { ReduxState as RS } from "../rx";

const Wrapper = styled.div`
  height: auto;
  width: auto;
  padding: 0;
  margin: 0;
`;

const CountryBorder = styled.path<{ fill: string; stroke: string }>`
  fill: ${(props) => props.fill};
  fill-opacity: 1;
  stroke: ${(props) => props.stroke};
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
  };
} = {
  asia: {
    scale: 3,
    translate: {
      x: -540,
      y: -280,
    },
    countries: new Set([
      "AF",
      "AM",
      "AZ",
      "BH",
      "BD",
      "BT",
      "BN",
      "KH",
      "CN",
      "CX",
      "CC",
      "IO",
      "GE",
      "HK",
      "IN",
      "ID",
      "IR",
      "IQ",
      "IL",
      "JP",
      "JO",
      "KZ",
      "KW",
      "KG",
      "LA",
      "LB",
      "MO",
      "MY",
      "MV",
      "MN",
      "MM",
      "NP",
      "KP",
      "OM",
      "PK",
      "PS",
      "PH",
      "QA",
      "SA",
      "SG",
      "KR",
      "LK",
      "SY",
      "TW",
      "TJ",
      "TH",
      "TR",
      "TM",
      "AE",
      "UZ",
      "VN",
      "YE",
    ]),
  },
  "north-america": {
    scale: 1.5,
    translate: {
      x: 80,
      y: 0,
    },
    countries: new Set([
      "AI",
      "AG",
      "AW",
      "BS",
      "BB",
      "BZ",
      "BM",
      "BQ",
      "VG",
      "CA",
      "KY",
      "CR",
      "CU",
      "CW",
      "DM",
      "DO",
      "SV",
      "GL",
      "GD",
      "GP",
      "GT",
      "HT",
      "HN",
      "JM",
      "MQ",
      "MX",
      "PM",
      "MS",
      "CW",
      "KN",
      "NI",
      "PA",
      "PR",
      "BQ",
      "SX",
      "KN",
      "LC",
      "PM",
      "VC",
      "TT",
      "TC",
      "US",
      "VI",
    ]),
  },
  "south-america": {
    scale: 3,
    translate: {
      x: -150,
      y: -440,
    },
    countries: new Set([
      "AR",
      "BO",
      "BR",
      "CL",
      "CO",
      "EC",
      "FK",
      "GF",
      "GY",
      "PY",
      "PE",
      "SR",
      "UY",
      "VE",
      "FRG",
    ]),
  },
  oceania: {
    scale: 4,
    translate: {
      x: -750,
      y: -470,
    },
    countries: new Set([
      "AS",
      "AU",
      "NZ",
      "CK",
      "TL",
      "FM",
      "FJ",
      "PF",
      "GU",
      "KI",
      "MP",
      "MH",
      "UM",
      "NR",
      "NC",
      "NU",
      "NF",
      "PW",
      "PG",
      "MP",
      "WS",
      "SB",
      "TK",
      "TO",
      "TV",
      "VU",
      "UM",
      "WF",
    ]),
  },
  europe: {
    scale: 4,
    translate: {
      x: -390,
      y: -210,
    },
    countries: new Set([
      "AL",
      "AD",
      "AT",
      "BY",
      "BE",
      "BA",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FO",
      "FI",
      "FR",
      "DE",
      "GI",
      "GR",
      "HU",
      "IS",
      "IE",
      "IM",
      "IT",
      "RS",
      "LV",
      "LI",
      "LT",
      "LU",
      "MK",
      "MT",
      "MD",
      "MC",
      "ME",
      "NL",
      "NO",
      "PL",
      "PT",
      "RO",
      "SM",
      "RS",
      "SK",
      "SI",
      "ES",
      "SE",
      "CH",
      "UA",
      "GB",
      "VA",
      "RS",
      "RU",
    ]),
  },
  africa: {
    scale: 3,
    translate: {
      x: -350,
      y: -360,
    },
    countries: new Set([
      "DZ",
      "AO",
      "SH",
      "BJ",
      "BW",
      "BF",
      "BI",
      "CM",
      "CV",
      "CF",
      "TD",
      "KM",
      "CG",
      "CD",
      "DJ",
      "EG",
      "GQ",
      "ER",
      "SZ",
      "ET",
      "GA",
      "GM",
      "GH",
      "GN",
      "GW",
      "CI",
      "KE",
      "LS",
      "LR",
      "LY",
      "MG",
      "MW",
      "ML",
      "MR",
      "MU",
      "YT",
      "MA",
      "MZ",
      "NA",
      "NE",
      "NG",
      "ST",
      "RE",
      "RW",
      "ST",
      "SN",
      "SC",
      "SL",
      "SO",
      "ZA",
      "SS",
      "SH",
      "SD",
      "SZ",
      "TZ",
      "TG",
      "TN",
      "UG",
      "CD",
      "ZM",
      "TZ",
      "ZW",
    ]),
  },
};

export function ColoringMap(props: Props) {
  const { region: regionKey } = props;

  const region = regions[regionKey];
  const width = useSelector((s: RS) => s.site.viewPort.width);
  const height = (width / 4) * 3; // 4:3 ratio map

  const pathData = useMemo(() => {
    // Build a path & a tooltip for each country
    const projection = geoMercator();
    const pathGenerator = geoPath().projection(projection);

    return geoData.features
      .filter((feature) => {
        if (region) return region.countries.has(feature.I);
        return true;
      })
      .map((feature) => {
        const isoCode = feature.I;
        const countryName = feature.N;
        const geoFeature: GeoJSON.Feature = {
          type: "Feature",
          properties: { NAME: countryName, ISO_A2: isoCode },
          geometry: {
            type: "MultiPolygon",
            coordinates: feature.C as GeoJSON.Position[][][],
          },
        };

        return {
          d: pathGenerator(geoFeature) as string,
          name: countryName,
          code: isoCode,
        };
      });
  }, [region]);

  return (
    <Wrapper>
      <svg
        height={`${height}px`}
        width={`${width}px`}
        style={{ background: "white" }}
      >
        <g
          transform={`scale(${
            (width / 1000) * (region?.scale || 1)
          }) translate (${region?.translate.x || 0},${
            240 + (region?.translate.y || 0)
          })`}
        >
          {pathData.map((data) => (
            <CountryBorder
              key={`path_${data.code}`}
              d={data.d}
              fill="white"
              stroke="black"
            />
          ))}
        </g>
      </svg>
    </Wrapper>
  );
}
