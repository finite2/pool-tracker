import React, { useState } from "react";
import styled from "styled-components";

import { ActionButton } from "./ActionButton";

const PlayerHolder = styled.div`
  display: flex;
  max-width: 1080px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Player = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: 500;
  margin: auto;
  justify-content: center;
  border: solid 1px black;
  border-radius: 8px;
  width: 150px;
  height: 50px;

  ${props => `
    background-color: ${props.selected ? `lightgreen;` : `burlywood;`}

    `}
`;

const PS = styled.div`
  margin-top: 20px;
`;

const PlayerInput = styled.input`
  border: 1px solid black;
  margin-right: 10px;
  border-radius: 8px;
  font-size: 18px;
  padding: 3px;
  height: 34px;
`;

const AddPlayerButton = styled.button`
  border: 1px solid black;
  border-radius: 8px;
  height: 40px;
  font-size: 18px;
`;

const playerRostom = ["Adriana", "Alex", "Marcus", "Peter", "Petra"];

export const PlayerSelect = props => {
  const { callback } = props;

  const [players, setPlayers] = useState(
    playerRostom.map(p => ({ name: p, score: 0, selected: false }))
  );
  const [playerName, setPlayerName] = useState("");

  const togglePlayer = p => {
    let newPlayer = [...players];
    let player = players.find(pl => pl === p);
    player.selected = !player.selected;
    setPlayers(newPlayer);
  };

  const addPlayer = p => {
    let newPlayer = [...players];
    newPlayer.push({ name: p, score: 0, selected: true });
    setPlayers(newPlayer);
  };

  const onStart = () => {
    callback(players.filter(p => p.selected));
  };

  return (
    <PS>
      <form
        onSubmit={e => {
          e.preventDefault();
          addPlayer(playerName);
          setPlayerName("");
        }}
      >
        <PlayerInput
          type="text"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
        />
        <AddPlayerButton>Add</AddPlayerButton>
      </form>

      <PlayerHolder>
        {players.map(p => (
          <Player
            onClick={() => togglePlayer(p)}
            key={p.name}
            selected={p.selected}
          >
            {p.name}
          </Player>
        ))}
      </PlayerHolder>

      <ActionButton
        onClick={onStart}
        nine={players.filter(p => p.selected).length > 1}
      >
        Save
      </ActionButton>
    </PS>
  );
};
