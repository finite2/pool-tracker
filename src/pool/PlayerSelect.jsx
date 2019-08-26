import React, { useState } from "react";
import styled from "styled-components";

import { ActionButton } from "./ActionButton";
import { Player } from "./Player";

const PlayerHolder = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: auto;
  max-width: 800px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const PlayerUI = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: 500;
  margin: 8px;
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

  const [players, setPlayers] = useState(playerRostom.map(p => new Player(p)));
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
          <PlayerUI
            onClick={() => togglePlayer(p)}
            key={p.name}
            selected={p.selected}
          >
            {p.name}
          </PlayerUI>
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
