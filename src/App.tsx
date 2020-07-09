import React, {useReducer} from 'react';
import immer from 'immer';

import Start from 'components/Start/Start';
import InPlay from 'components/InPlay/InPlay';
import Scores from 'components/Scores/Scores';
import {getId, avatarUtils} from 'utils';

import {stateType, actionTypes, gameStateType} from 'types';
import css from './App.module.css';

const browserState = localStorage.getItem('currentgame');

const defaultState = (): stateType => ({
  gameState: 'start' as gameStateType,
  players: [
    {
      name: 'Tom',
      score: 0,
      id: getId(),
      avatar: avatarUtils.get(),
    },
    {
      name: 'Amy',
      score: 0,
      id: getId(),
      avatar: avatarUtils.get(),
    },
  ],
});
const initialState =
  browserState != null ? JSON.parse(browserState) : defaultState();

const reducer = (state: stateType, action: actionTypes): stateType => {
  const newState = immer(state, (draft) => {
    switch (action.type) {
      case 'players/add':
        draft.players.push({
          name: action.payload.name,
          score: 0,
          id: action.payload.id,
          avatar: action.payload.avatar,
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
      case 'game/restart':
        return action.payload;
      default:
        break;
    }
  });
  localStorage.setItem('currentgame', JSON.stringify(newState));
  return newState;
};

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <section className={css.header}>
        <h1>DJ Game</h1>
        <div className={css.toolbar}>
          {state.gameState !== 'start' && state.gameState !== 'finished' && (
            <button
              onClick={() => {
                dispatch({type: 'game/end'});
              }}
            >
              Finish
            </button>
          )}
        </div>
      </section>
      {state.gameState === 'start' && (
        <Start players={state.players} dispatch={dispatch} />
      )}
      {state.gameState === 'inplay' && (
        <InPlay players={state.players} appDispatch={dispatch} />
      )}
      {state.gameState === 'finished' && (
        <section>
          <Scores players={state.players} />
          <button
            onClick={() => {
              avatarUtils.reset();
              localStorage.clear();
              dispatch({type: 'game/restart', payload: defaultState()});
            }}
          >
            Restart
          </button>
        </section>
      )}
    </div>
  );
}

export default App;
