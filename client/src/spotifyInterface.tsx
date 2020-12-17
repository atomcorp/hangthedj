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
  playCallback: () => void;
};

const play = ({
  spotify_uri,
  playerInstance: {
    _options: {getOAuthToken, id},
  },
  playCallback,
}: playerType): void => {
  getOAuthToken((access_token: string) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({uris: [spotify_uri]}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      console.log('playing');
      playCallback();
    });
  });
};

const playerRef: playerRefType = {
  player: null,
  token: token,
  play: () => null,
  pause: () => null,
  resume: () => null,
  isPlaying: false,
  setIsPlayingListener: (callback) => {
    playerRef.isPlayingListener = callback;
  },
  isPlayingListener: null,
  hasPickedTrack: false,
  togglePickedTrack: () => {
    playerRef.hasPickedTrack = !playerRef.hasPickedTrack;
  },
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
  playerRef.play = (spotify_uri: string) => {
    play({
      playerInstance: player,
      spotify_uri: `spotify:track:${spotify_uri}`,
      playCallback: () => {},
    });
  };
  playerRef.pause = () => {
    player.pause().then(() => {});
  };
  playerRef.resume = () => {
    player.resume().then(() => {});
  };
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
    if (playerRef.isPlayingListener != null) {
      playerRef.isPlayingListener(
        !state.paused,
        `${state.track_window.current_track.artists[0].name} - ${state.track_window.current_track.name}`
      );
    }
  });
  // TODO: Add a callback to alert the app
  // Ready
  player.addListener('ready', ({device_id}) => {
    console.log(device_id);
  });
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
