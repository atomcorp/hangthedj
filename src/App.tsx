import React, {useReducer, useEffect} from 'react';
import immer from 'immer';

import './App.css';

import Start from 'components/Start/Start';
import InPlay from 'components/InPlay/InPlay';
import {getId} from 'utils';

import {
  stateType,
  actionTypes,
  googleSheetsType,
  cardsType,
  gameStateType,
} from 'types';

const defaultState = {
  gameState: 'inplay' as gameStateType,
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
      default:
        break;
    }
  });
};

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <div className="App">
      <h1>Amy and Tom&apos;s game</h1>
      {state.gameState === 'start' && (
        <Start players={state.players} dispatch={dispatch} />
      )}
      {state.gameState === 'inplay' && <InPlay players={state.players} />}
    </div>
  );
}

export default App;
