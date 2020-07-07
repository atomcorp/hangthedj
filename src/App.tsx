import React, {useReducer} from 'react';
import immer from 'immer';

import './App.css';

import Start from 'components/Start/Start';
import InPlay from 'components/InPlay/InPlay';
import {getId} from 'utils';

import {stateType, actionTypes, gameStateType} from 'types';

const defaultState = {
  gameState: 'start' as gameStateType,
  players: [
    {
      name: 'Tom',
      score: 0,
      id: getId(),
    },
    {
      name: 'Amy',
      score: 0,
      id: getId(),
    },
  ],
};

const reducer = (state: stateType, action: actionTypes): stateType => {
  return immer(state, (draft) => {
    switch (action.type) {
      case 'players/add':
        draft.players.push({
          name: action.payload,
          score: 0,
          id: getId(),
        });
        break;
      case 'game/start':
        draft.gameState = 'inplay';
        break;
      case 'game/scores':
        draft.players.forEach((player) => {
          if (player.id in action.payload) {
            player.score += action.payload[player.id];
          }
        });
        break;
      case 'game/end':
        draft.gameState = 'finished';
        break;
      default:
        break;
    }
  });
};

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <div className="App">
      <h1>AOM</h1>
      {state.gameState === 'start' && (
        <Start players={state.players} dispatch={dispatch} />
      )}
      {state.gameState === 'inplay' && (
        <InPlay players={state.players} appDispatch={dispatch} />
      )}
      {state.gameState === 'finished' && (
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {[...state.players]
              .sort((a, b) => (a.score < b.score ? 1 : -1))
              .map((player, i) => (
                <tr key={i}>
                  <td>{player.name}</td>
                  <td>{player.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
