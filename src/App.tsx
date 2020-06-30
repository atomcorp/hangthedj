import React, {useReducer} from 'react';
import immer from 'immer';

import './App.css';

import Start from 'components/Start/Start';

import {stateType, actionTypes} from 'types';

const defaultState = {
  players: [
    {
      name: 'Tom',
      score: 0,
    },
    {
      name: 'Amy',
      score: 0,
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
        });
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
      <Start players={state.players} dispatch={dispatch} />
    </div>
  );
}

export default App;
