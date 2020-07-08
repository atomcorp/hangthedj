import React, {useReducer} from 'react';
import immer from 'immer';

import Start from 'components/Start/Start';
import InPlay from 'components/InPlay/InPlay';
import Scores from 'components/Scores/Scores';
import {getId, getAvatar} from 'utils';

import {stateType, actionTypes, gameStateType} from 'types';
import css from './App.module.css';

const browserState = window.localStorage.getItem('currentgame');

const defaultState =
  browserState != null
    ? JSON.parse(browserState)
    : {
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
  const newState = immer(state, (draft) => {
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
      case 'game/restart':
        return defaultState;
      default:
        break;
    }
  });
  localStorage.setItem('currentgame', JSON.stringify(newState));
  return newState;
};

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <div>
      <section className={css.header}>
        <h1>DJ Game</h1>
        <div className={css.toolbar}>
          {state.gameState !== 'start' && (
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
              dispatch({type: 'game/restart'});
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
