import React from 'react';

import {playersType} from 'types';

const Scores = (props: propsTypes): JSX.Element => (
  <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {[...props.players]
        .sort((a, b) => (a.score < b.score ? 1 : -1))
        .map((player, i) => (
          <tr key={i}>
            <td>{player.name}</td>
            <td>{player.score}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

type propsTypes = {
  players: playersType;
};

export default Scores;
