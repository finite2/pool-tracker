import React, { useState, useEffect } from "react";

import { Vertical } from "./components/Layout";
import { ActionButton } from "./ActionButton";
import { WhoseTurnNow, ScoreButtonHolder } from "./components/WhoseTurnNow";
import { ScoreCard } from "./ScoreCard";
import { Player } from "./Player";

import { shuffle } from "./utils/shuffle";

const setScores = players => {
  for (let i = 0; i < players.length; i++) {
    players[i].score = 2;
  }

  return players;
};

class PlayState {
  constructor(players) {
    this.gameOver = false;
    this.next = shuffle(players.map(p => p.name));
    this.nextRound = [];
    this.random = false;
  }
}

const handleTurnEnd = st => {
  if (st.random) {
    let move = st.next.shift();
    if (!st.next.includes(move)) {
      st.nextRound.push(move);
    }
    if (st.next.length === 1) {
      st.nextRound.push(st.next[0]);
      st.nextRound = shuffle(st.nextRound);
      st.next = st.next.concat(st.nextRound);
      st.nextRound = [];
    }
  } else {
    toEnd(st.next);
  }
};

const handleOut = (st, name) => {
  st.next.shift();
  let idx = st.next.findIndex(n => n === name);
  if (idx !== -1) {
    st.next.splice(idx, 1);
  }
};

const toEnd = arr => {
  let move = arr.shift();
  arr.push(move);
};

const Killer = props => {
  const { home } = props;
  const [players, setPlayers] = useState([]);
  const [turnState, setTurnState] = useState({});

  const newGame = () => {
    setPlayers(setScores(props.players));
    setTurnState(new PlayState(props.players));
  };

  useEffect(newGame, [props.players]);

  const setPlayState = action => {
    let thisTurnState = { ...turnState };

    if (action === "miss") {
      let thisPlayers = [...players];
      let player = thisPlayers.find(p => p.name === turnState.next[0]);
      player.score -= 1;
      if (player.score === 0) {
        player.score = -thisTurnState.next.length;
        handleOut(thisTurnState, player.name);
      } else {
        handleTurnEnd(thisTurnState);
      }
      if (thisTurnState.next.length + thisTurnState.nextRound.length === 1) {
        thisTurnState.gameOver = true;
      }
      setPlayers(thisPlayers);
    } else if (action === "pot") {
      handleTurnEnd(thisTurnState);
    } else if (action === "black") {
      let thisPlayers = [...players];
      let player = thisPlayers.find(p => p.name === turnState.next[0]);
      player.score += 1;
      handleTurnEnd(thisTurnState);
      setPlayers(thisPlayers);
    }

    setTurnState(thisTurnState);
  };

  const addALife = () => {
    let thisPlayers = [...players];

    for (let i = 0; i < thisPlayers.length; i++) {
      thisPlayers[i].score += 1;
    }

    setPlayers(thisPlayers);
  };

  const toggleRandomOrder = () => {
    let thisTurnState = { ...turnState };
    thisTurnState.random = !thisTurnState.random;
    setTurnState(thisTurnState);
  };

  if (turnState.gameOver) {
    return (
      <Vertical>
        <ScoreCard killer={true} players={players} />
        <ActionButton onClick={newGame} nine={true}>
          New game
        </ActionButton>
        <ActionButton onClick={home} pot={true}>
          Home
        </ActionButton>
      </Vertical>
    );
  }

  if (players.length) {
    return (
      <div>
        <div>
          <WhoseTurnNow>
            <h4>{turnState.next[0]}</h4>
            <h4>It's your turn</h4>
          </WhoseTurnNow>
        </div>
        <div>
          <h4>Action</h4>
          <ScoreButtonHolder>
            <ActionButton
              onClick={() => setPlayState("miss")}
              miss={true}
              style={{ width: "33.3%" }}
            >
              Miss
            </ActionButton>
            <ActionButton
              onClick={() => setPlayState("pot")}
              pot={true}
              style={{ width: "33.3%" }}
            >
              Potted
            </ActionButton>
            <ActionButton
              onClick={() => setPlayState("black")}
              nine={true}
              style={{ width: "33.3%" }}
            >
              Pot black
            </ActionButton>
          </ScoreButtonHolder>
        </div>
        <div>
          <h4>Who is next</h4>
          <ActionButton>
            <h4>Next</h4>
            <h4>{turnState.next[1]}</h4>
          </ActionButton>
          {turnState.next.length > 2 ? (
            <ActionButton>
              <h4>And then</h4>
              <h4>{turnState.next[2]}</h4>
            </ActionButton>
          ) : null}
        </div>
        <ScoreCard killer={true} players={players} />
        <div>
          <ActionButton nine={true} small={true} onClick={addALife}>
            Extra life
          </ActionButton>
          <ActionButton
            miss={turnState.random}
            small={true}
            onClick={toggleRandomOrder}
          >
            Random order
          </ActionButton>
        </div>
      </div>
    );
  }
  return null;
};

export default Killer;
