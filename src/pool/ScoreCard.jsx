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

export const ScoreCard = props => {
  const { players } = props;

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
                <Cell>{p.score}</Cell>
              </ScoreDiv>
            ))}
        </>
      </div>
    );
  }
  return null;
};
