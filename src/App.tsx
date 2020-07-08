import React, {useReducer} from 'react';
import immer from 'immer';

import Start from 'components/Start/Start';
import InPlay from 'components/InPlay/InPlay';
import Scores from 'components/Scores/Scores';
import {getId, getAvatar} from 'utils';

import {stateType, actionTypes, gameStateType} from 'types';

const defaultState = {
  gameState: 'start' as gameStateType,
  players: [
    {
      name: 'Tom',
      score: 0,
      id: getId(),
      avatar: getAvatar(),
    },
    {
      name: 'Amy',
      score: 0,
      id: getId(),
      avatar: getAvatar(),
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
          avatar: getAvatar(),
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
      <h1>DJ Game</h1>
      {state.gameState === 'start' && (
        <Start players={state.players} dispatch={dispatch} />
      )}
      {state.gameState === 'inplay' && (
        <InPlay players={state.players} appDispatch={dispatch} />
      )}
      {state.gameState === 'finished' && <Scores players={state.players} />}
    </div>
  );
}

export default App;
