import React, { useState } from "react";
import styled from "styled-components";

import { ActionButton } from "./ActionButton";
import { ScoreCard } from "./ScoreCard";

const scoreFun = ({ foul, pot, nine }) => pot + !foul * 4.5 * nine - 1.5 * foul;

const random = count => Math.floor(Math.random() * count);

const shuffle = array => {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }
}

class PlayState {
  constructor(players) {
    this.foul = false;
    this.miss = false;
    this.pot = 0;
    this.nine = false;
    this.gameOver = false;

    let playersCopy = [...players];

    let idx = random(playersCopy.length);
    this.current = playersCopy[idx].name;
    playersCopy.splice(idx, 1);
    idx = random(playersCopy.length);
    this.previous = playersCopy[idx].name;
    playersCopy.splice(idx, 1);

    shuffle(playersCopy);
    this.next = playersCopy.map(p => p.name);
  }
}

const ScoreButtonHolder = styled.div`
  display: flex;
  max-width: 80%;
  margin: auto;
`;

const WhoseTurnNow = styled.div`
  margin: auto;
  margin-top: 10px;
  font-size: 24px;
  border: 1px solid black;
  border-radius: 8px;
  background-color: yellow;
  width: 20%;
  height: 100px;
`;

const Nineball = props => {
  const [players, setPlayers] = useState(props.players);

  const [turnState, setTurnState] = useState(new PlayState(players));

  const addPlayer = name => {
    let curPlayers = [...players];
    curPlayers.push(new Player(name));
    setPlayers(curPlayers);
  };

  const setPlayState = action => {
    let thisState = { ...turnState };
    if (action === "reset") {
      thisState.foul = false;
      thisState.miss = false;
      thisState.pot = 0;
      thisState.nine = false;
    } else if (action === "foul") {
      thisState.foul = !thisState.foul;
    } else if (action === "miss") {
      thisState.miss = !thisState.miss;
    } else if (action === "pot") {
      thisState.pot += 1;
    } else if (action === "nine") {
      thisState.nine = !thisState.nine;
    } else if (action === "submit") {
      if (!thisState.foul && !thisState.miss && !thisState.nine) {
        thisState.pot = 0;
      } else {
        let score = scoreFun(thisState);
        let thisPlayers = [...players];
        let currentPlayer = thisPlayers.find(p => p.name === thisState.current);
        currentPlayer.score += score;

        let next, previous, current;

        if (thisState.nine) {
          current = thisState.current;
          previous = thisState.previous;
          next = thisState.next;
        } else if (thisState.foul && thisState.pot === 0) {
          current = thisState.previous;
          previous = thisState.current;
          next = thisState.next.reverse();
        } else {
          current = thisState.next[0];
          previous = thisState.current;
          next = thisState.next.slice(1);
          next.push(thisState.previous);
        }

        if (thisState.nine) {
          thisState.gameOver = true;
        }

        thisState.current = current;
        thisState.previous = previous;
        thisState.next = next;

        thisState.foul = false;
        thisState.miss = false;
        thisState.pot = 0;

        setPlayers(thisPlayers);
      }
    }

    setTurnState(thisState);
  };

  const newGame = () => {
    setTurnState(new PlayState(players));
  };

  if (turnState.gameOver) {
    return (
      <div>
        <ScoreCard players={players} />
        <ActionButton onClick={newGame} nine={true}>
          New round
        </ActionButton>
      </div>
    );
  }

  return (
    <div>
      <div>
        <WhoseTurnNow>
          <h4>{turnState.current}</h4>
          <h4>It's your turn</h4>
        </WhoseTurnNow>
      </div>
      <div>
        <h4>Action</h4>
        <ScoreButtonHolder>
          <ActionButton
            onClick={() => setPlayState("foul")}
            foul={turnState.foul}
          >
            Foul
          </ActionButton>
          <ActionButton
            onClick={() => setPlayState("miss")}
            miss={turnState.miss}
          >
            Miss
          </ActionButton>
          <ActionButton onClick={() => setPlayState("pot")} pot={turnState.pot}>
            Potted {turnState.pot}
          </ActionButton>
          <ActionButton
            onClick={() => setPlayState("nine")}
            nine={turnState.nine}
          >
            Nine
          </ActionButton>
        </ScoreButtonHolder>
        <ActionButton
          onClick={() => setPlayState("reset")}
          foul={
            turnState.foul || turnState.nine || turnState.miss || turnState.pot
          }
        >
          Reset
        </ActionButton>
        <ActionButton
          onClick={() => setPlayState("submit")}
          pot={turnState.foul || turnState.nine || turnState.miss}
        >
          Submit
        </ActionButton>
      </div>
      <div>
        <h4>Who is next</h4>
        <ActionButton onClick={() => setPlayState("foul")}>
          <h4>On Foul</h4>
          <h4>{turnState.previous}</h4>
        </ActionButton>
        <ActionButton onClick={() => setPlayState("miss")}>
          <h4>On Miss</h4>
          <h4>{turnState.next[0]}</h4>
        </ActionButton>
      </div>
      <ScoreCard players={players} />
    </div>
  );
};

export default Nineball;
