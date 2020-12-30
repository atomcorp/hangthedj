import React from 'react';

import {makeSpotifyRequest} from 'firebaseActions';

const PlayTest = (): JSX.Element => {
  return (
    <section>
      <button
        onClick={() => {
          makeSpotifyRequest();
        }}
      >
        Test Spotify Request
      </button>
      <button
        onClick={() => {
          fetch(
            'https://api.spotify.com/v1/me/player/play?device_id=e096101ed5cf8c43fc6edd083553d8e7f66b6c6c',
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ERRROR',
              },
              method: 'PUT',
              body: JSON.stringify({
                uris: ['spotify:track:4qYlBtzkmby4r1N7etPnUv'],
              }),
            }
          )
            .then((res) => {
              if (res.status === 200) {
                return res.json();
              }
            })
            .then((res) => {
              // eslint-disable-next-line no-console
              console.log(res);
            });
        }}
      >
        Play
      </button>
    </section>
  );
};

export default PlayTest;
