import React, {useState, useEffect} from 'react';

import {IS_DEBUG} from 'App';
import {useHistory} from 'react-router-dom';

const apiBase =
  process.env.NODE_ENV === 'development'
    ? 'http://192.168.86.37:3000'
    : 'https://www.atomcorp.dev';

export const redirectURI = `${apiBase}/play/redirect`;

const buildAuthUrl = (randomString: string): string =>
  `https://accounts.spotify.com/authorize?client_id=5280f2bd9b014405839ea087c05c58d1&response_type=code&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&scope=${encodeURIComponent(
    'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state'
  )}&state=${randomString}&show_dialog=${IS_DEBUG}`;

const GetSpotifyAuth = (): JSX.Element => {
  const onClick = (): void => {
    const randomString = Math.random().toString(36).substring(7);
    localStorage.setItem('authState', randomString);
    window.location.assign(buildAuthUrl(randomString));
  };
  return (
    <section>
      <div>
        <button onClick={onClick}>Get Spotify Auth</button>
      </div>
    </section>
  );
};

export default GetSpotifyAuth;
