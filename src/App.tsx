/// <reference types="spotify-web-playback-sdk" />
import React, {useReducer, useState} from 'react';
import immer from 'immer';

import Start from 'components/Start/Start';
import InPlay from 'components/InPlay/InPlay';
import Scores from 'components/Scores/Scores';
import {avatarUtils} from 'utils';
import player from 'spotifyInterface';
import Player from 'components/Player/Player';

import {stateType, actionTypes, gameStateType} from 'types';
import css from './App.module.css';

const browserState = localStorage.getItem('currentgame');

const defaultState = (): stateType => ({
  gameState: 'start' as gameStateType,
  players: [],
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
  const [tempPlayerToken, setTempPlayerToken] = useState(player.token);
  return (
    <div>
      <section style={{minHeight: '100vh'}}>
        <section className={css.header}>
          <h1>Pass the AUX</h1>
          <div className={css.toolbar}>
            <Player />
          </div>
        </section>
        <hr />
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
      </section>
      <br />
      <br />
      <br />
      <br />
      <details>
        <summary>Debug</summary>
        <pre>
          <code>
            Debug:
            {player.token != null ? 'Logged in' : 'Logged out'}
            <br />
            token: {tempPlayerToken}
            <br />
            <a
              href={`https://accounts.spotify.com/authorize?client_id=5280f2bd9b014405839ea087c05c58d1&response_type=token&redirect_uri=${encodeURIComponent(
                window.location.host === 'localhost:3000'
                  ? 'http://localhost:3000/callback'
                  : 'https://atomcorp.github.io/hangthedj/'
              )}&scope=${encodeURIComponent(
                'streaming user-read-email user-read-private user-modify-playback-state'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Authenticate
            </a>
            <br />
            <button
              type="button"
              onClick={() => {
                if (player.token !== tempPlayerToken) {
                  setTempPlayerToken(player.token);
                }
              }}
            >
              Re-auth
            </button>
            {state.gameState !== 'start' && state.gameState !== 'finished' && (
              <button
                onClick={() => {
                  dispatch({type: 'game/end'});
                }}
              >
                Finish
              </button>
            )}
          </code>
        </pre>
      </details>
    </div>
  );
}

type propsType = {};

export default App;
