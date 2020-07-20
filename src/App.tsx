/// <reference types="spotify-web-playback-sdk" />
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

let token: string | null = null;

const setToken = (): void => {
  if (window.location.hash && window.location.hash[0] === '#') {
    const params = window.location.hash.slice(1).split('&');
    params.forEach((param) => {
      if (param.includes('access_token')) {
        token = param.split('=')[1];
      }
    });
  }
};

type SpotyifyOptionsType = {
  _options: {
    name: string;
    getOAuthToken(cb: (token: string) => void): void;
    volume?: number;
    id: string;
  };
};

type playerType = {
  spotify_uri: string;
  playerInstance: Spotify.SpotifyPlayer & SpotyifyOptionsType;
};

const play = ({
  spotify_uri,
  playerInstance: {
    _options: {getOAuthToken, id},
  },
}: playerType): void => {
  getOAuthToken((access_token: string) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({uris: [spotify_uri]}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });
  });
};

window.onSpotifyWebPlaybackSDKReady = () => {
  const Spotify = window.Spotify;
  setToken();
  // You can now initialize Spotify.Player and use the SDK
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: (cb) => {
      if (token) {
        cb(token);
      }
    },
  }) as Spotify.SpotifyPlayer & SpotyifyOptionsType;
  // Error handling
  player.addListener('initialization_error', ({message}) => {
    console.error(message);
  });
  player.addListener('authentication_error', ({message}) => {
    console.error(message);
  });
  player.addListener('account_error', ({message}) => {
    console.error(message);
  });
  player.addListener('playback_error', ({message}) => {
    console.error(message);
  });
  // Playback status updates
  player.addListener('player_state_changed', (state) => {
    console.log(state);
  });
  // Ready
  player.addListener('ready', ({device_id}) => {
    play({
      playerInstance: player,
      spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
    });
  });
  // Not Ready
  player.addListener('not_ready', ({device_id}) => {
    console.log('Device ID has gone offline', device_id);
  });
  // Connect to the player!
  player.connect();
};

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <a
        href={`https://accounts.spotify.com/authorize?client_id=5280f2bd9b014405839ea087c05c58d1&response_type=token&redirect_uri=${encodeURIComponent(
          'http://localhost:3000/callback'
        )}&scope=${encodeURIComponent(
          'streaming user-read-email user-read-private user-modify-playback-state'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Test flow
      </a>
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
