import React, { useState, useMemo } from "react";
import styled from "styled-components";

import { PageWrapper } from "../common";
import { pokemons, Pokemon } from "./pokemons";
import { Button, TextInput } from "../Manta";
import { times } from "../../lib/util";
import { BopomofoText } from "../common/BopomofoText";

// https://cmex-30.github.io/Bopomofo_on_Web/testpage/index.html

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const PokemonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 2rem;
  cursor: pointer;
`;

const PokemonImage = styled.img`
  max-width: 20rem;
`;

const NameChar = styled.ruby`
  font-size: 3rem;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: 0.3rem;
  font-family: BopomofoPro, Muli;
  rt {
    font-size: 0.23em;
    text-align: center;
    margin-left: -0.5em;
    margin-right: 0.5em;
  }
`;

const SubName = styled.div`
  font-size: 2rem;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: 0.2rem;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.4rem;
  text-align: center;
`;

export function Pokedex() {
  const [page, setPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(
    null as Pokemon | null
  );
  const [filter, setFilter] = useState("" as string);
  const pageSize = 21;

  // const allCharacters = new Set();
  // pokemons.forEach((p) => {
  //   p.name.split("").forEach((c) => allCharacters.add(c));
  //   p.subName.split("").forEach((c) => allCharacters.add(c));
  // });
  // console.log(allCharacters.size, Array.from(allCharacters));

  const filtered = useMemo(() => {
    if (!filter.length) return pokemons;
    return pokemons.filter(
      (p) => p.name.search(filter) >= 0 || p.subName.search(filter) >= 0
    );
  }, [filter]);

  const pages = Math.ceil(filtered.length / pageSize);
  const offset = page * pageSize;
  const limit = pageSize;
  const chunk = filtered.slice(offset, offset + limit);

  return (
    <PageWrapper>
      <div
        className="py-4 d-print-none"
        style={{ borderBottom: `1px solid #333` }}
      >
        <Title className="py-4">寶可夢圖鑑</Title>
        <TextInput label="搜尋" value={filter} onValueChanged={setFilter} />
        <div
          className="d-flex"
          style={{
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {times(pages).map((p) => {
            return (
              <Button
                primary
                outline={p !== page}
                key={p}
                style={{ marginRight: "0.2rem", marginBottom: "0.2rem" }}
                onClick={() => {
                  setPage(p);
                }}
              >
                {p + 1}
              </Button>
            );
          })}
        </div>
      </div>
      <Wrapper className="my-4 d-print-none">
        {chunk.map((p, i) => {
          return (
            <PokemonWrapper key={i} className="mb-4 mx-2">
              <PokemonImage src={p.url} onClick={() => setSelectedPokemon(p)} />
              <BopomofoText text={p.name} component={NameChar} />
              <SubName>{p.subName}&nbsp;</SubName>
            </PokemonWrapper>
          );
        })}
      </Wrapper>
      <div
        className="d-flex"
        style={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: "#FFFFFFAA",
          position: "fixed",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column",
          transition: "opacity 0.2s ease-in-out",
          opacity: selectedPokemon ? 1 : 0,
          zIndex: selectedPokemon ? 1000 : -1,
        }}
        onClick={() => setSelectedPokemon(null)}
      >
        <img src={selectedPokemon?.url} />
        <div style={{ flex: 1 }}>
          <BopomofoText text={selectedPokemon?.name} component={NameChar} />
        </div>
      </div>
      <div
        className="py-4 d-print-none"
        style={{ borderBottom: `1px solid #333` }}
      >
        <div
          className="d-flex"
          style={{
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {times(pages).map((p) => {
            return (
              <Button
                primary
                outline={p !== page}
                key={p}
                style={{ marginRight: "0.2rem", marginBottom: "0.2rem" }}
                onClick={() => {
                  setPage(p);
                }}
              >
                {p + 1}
              </Button>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
