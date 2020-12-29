import React from 'react';
import {useSelector} from 'react-redux';

import {RootState} from 'rootReducer';

const PlayTest = (): JSX.Element => {
  const spotifyToken = useSelector(
    (state: RootState) => state.user.spotifyAccessToken
  );
  return (
    <section>
      <button
        onClick={() => {
          fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${spotifyToken}`,
            },
          })
            .then(async (res) => {
              if (res.status === 200) {
                return res.json();
              } else {
                throw await res.json();
              }
            })
            .then((res) => {
              console.log(res);
            })
            .catch((res: {error: {status: number; message: string}}) => {
              console.log(res.error.message);
            });
        }}
      >
        Devices
      </button>
      <button
        onClick={() => {
          fetch(
            'https://api.spotify.com/v1/me/player/play?device_id=e096101ed5cf8c43fc6edd083553d8e7f66b6c6c',
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${spotifyToken}`,
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
