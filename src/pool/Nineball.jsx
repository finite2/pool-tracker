import React, { useState } from "react";

import { Vertical } from "./components/Layout";
import { ActionButton } from "./ActionButton";
import { ScoreCard } from "./ScoreCard";
import { WhoseTurnNow, ScoreButtonHolder } from "./components/WhoseTurnNow";

import { shuffle } from "./utils/shuffle";
import { Player } from "./Player";

const scoreFun = ({ foul, pot, nine }) => pot + !foul * 4.5 * nine - 1.5 * foul;

const random = count => Math.floor(Math.random() * count);

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

const Nineball = props => {
  const { home } = props;
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
    } else if (action === "new-round") {
      thisState.gameOver = true;
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
        <ScoreButtonHolder>
          <ActionButton onClick={newGame} nine={true}>
            New round
          </ActionButton>
          <ActionButton onClick={home} pot={true}>
            Home
          </ActionButton>
        </ScoreButtonHolder>
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
        <ScoreButtonHolder>
          <ActionButton
            onClick={() => setPlayState("reset")}
            foul={
              turnState.foul ||
              turnState.nine ||
              turnState.miss ||
              turnState.pot
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
          <ActionButton onClick={() => setPlayState("new-round")}>
            New Round
          </ActionButton>
        </ScoreButtonHolder>
      </div>
      <div>
        <h4>Who's next</h4>
        <ActionButton foul={true}>
          <h4>On Foul</h4>
          <h4>{turnState.pot > 0 ? turnState.next : turnState.previous}</h4>
        </ActionButton>
        <ActionButton miss={true}>
          <h4>On Miss</h4>
          <h4>{turnState.next[0]}</h4>
        </ActionButton>
      </div>
      <ScoreCard players={players} />
    </div>
  );
};

export default Nineball;
