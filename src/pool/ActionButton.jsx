import React, { useState } from "react";
import styled from "styled-components";

export const ActionButton = styled.button`
  box-sizing: border-box;
  margin: 10px;
  width: 25%;
  height: 150px;
  font-size: 24px;
  font-weight: 600;
  border: solid 1px black;
  border-radius: 8px;
  cursor: pointer;

  h4 {
    font-size: 24px;
  }

  ${props => `
    ${props.foul ? `background-color: red;` : ``}
    ${props.miss ? `background-color: orange;` : ``}
    ${props.pot ? `background-color: lightskyblue;` : ``}
    ${props.nine ? `background-color: limegreen;` : ``}

    `}
`;
