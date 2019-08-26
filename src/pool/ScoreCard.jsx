import React from "react";
import styled from "styled-components";

const Cell = styled.div`
  width: 50%;
  font-size: 18px;
  font-weight: 600;

  &:not(:first-child) {
    border-left: solid 1px black;
  }
`;

const ScoreDiv = styled.div`
  margin: auto;
  width: 400px;
  display: flex;

  &:not(:last-child) {
    border-bottom: solid 1px black;
  }

  ${props =>
    props.score && props.score > 0
      ? `color: darkgreen; background-color: #90d8a7;`
      : ``};

  ${props =>
    props.score && props.score < 0
      ? `color: darkred; background-color: #db9f9f;`
      : ``};
`;

const textScore = score => {
  if (score < 0) {
    return [
      "",
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th"
    ][-score];
  } else if (score === 1) {
    return `1 life left`;
  }
  return `${score} lives left`;
};

export const ScoreCard = props => {
  const { players, killer = false } = props;

  if (players && players.length) {
    return (
      <div>
        <h4>Current score</h4>
        <ScoreDiv>
          <Cell>Name</Cell>
          <Cell>Score</Cell>
        </ScoreDiv>
        <>
          {players
            .sort((a, b) => b.score - a.score)
            .map(p => (
              <ScoreDiv score={p.score} key={p.name}>
                <Cell>{p.name}</Cell>
                <Cell>{killer ? textScore(p.score) : p.score}</Cell>
              </ScoreDiv>
            ))}
        </>
      </div>
    );
  }
  return null;
};
