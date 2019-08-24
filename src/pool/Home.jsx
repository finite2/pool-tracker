import React, { useState } from "react";
import styled from "styled-components";

import { ActionButton } from "./ActionButton";

import Nineball from "./Nineball";
import { PlayerSelect } from "./PlayerSelect";

const Vertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Home = props => {
  const [mode, setMode] = useState("");
  const [players, setPlayers] = useState([]);

  const playerSelectCallback = p => {
    setPlayers(p);
    setMode("");
  };

  if (mode === "nine") {
    return <Nineball players={players} />;
  } else if (mode === "playerSelect") {
    return <PlayerSelect callback={playerSelectCallback} />;
  }

  return (
    <Vertical>
      <ActionButton
        onClick={() => setMode("playerSelect")}
        pot={players.length > 1}
      >
        Select players
      </ActionButton>
      <ActionButton onClick={() => setMode("nine")} nine={players.length > 2}>
        9 ball pool
      </ActionButton>
    </Vertical>
  );
};

export default Home;
