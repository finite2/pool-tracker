import React, { useState } from "react";

import { Vertical } from "./components/Layout";
import { ActionButton } from "./ActionButton";

import Nineball from "./Nineball";
import Killer from "./Killer";
import { PlayerSelect } from "./PlayerSelect";

const Home = () => {
  const [mode, setMode] = useState("");
  const [players, setPlayers] = useState([]);

  const playerSelectCallback = p => {
    setPlayers(p);
    setMode("");
  };

  if (mode === "killer") {
    return <Killer players={players} home={() => setMode("")} />;
  } else if (mode === "nine") {
    return <Nineball players={players} home={() => setMode("")} />;
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
      <ActionButton
        onClick={() => {
          if (players.length > 2) setMode("killer");
        }}
        nine={players.length > 2}
      >
        Killer pool
      </ActionButton>
      <ActionButton
        onClick={() => {
          if (players.length > 2) setMode("nine");
        }}
        nine={players.length > 2}
      >
        9 ball pool
      </ActionButton>
    </Vertical>
  );
};

export default Home;
