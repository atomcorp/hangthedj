import {playerRefType, SpotifyOptionsType} from 'types';

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

type playerType = {
  spotify_uri: string;
  playerInstance: Spotify.SpotifyPlayer & SpotifyOptionsType;
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

const playerRef: playerRefType = {
  player: null,
  token: token,
  play: () => {},
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
  }) as Spotify.SpotifyPlayer & SpotifyOptionsType;
  // assign properties to the interface
  playerRef.player = player;
  playerRef.token = token;
  playerRef.play = () => {
    play({
      playerInstance: player,
      spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
    });
  };
  // Error handling
  // player.addListener('initialization_error', ({message}) => {
  //   console.error(message);
  // });
  // player.addListener('authentication_error', ({message}) => {
  //   console.error(message);
  // });
  // player.addListener('account_error', ({message}) => {
  //   console.error(message);
  // });
  // player.addListener('playback_error', ({message}) => {
  //   console.error(message);
  // });
  // Playback status updates
  // player.addListener('player_state_changed', (state) => {
  //   console.log(state);
  // });
  // Ready
  player.addListener('ready', ({device_id}) => {});
  // Not Ready
  // player.addListener('not_ready', ({device_id}) => {
  //   console.log('Device ID has gone offline', device_id);
  // });
  // Connect to the player!
  player.connect();
  return {
    player,
  };
};

export default playerRef;
