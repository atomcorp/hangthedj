import React, {useEffect, useState} from 'react';

import player from 'spotifyInterface';

const Player = (): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState('');
  useEffect(() => {
    if (player.setIsPlayingListener != null) {
      player.setIsPlayingListener((bool: boolean, track: string | null) => {
        setIsPlaying(bool);
        setNowPlaying(track ?? '');
      });
    }
  }, []);
  return (
    <section>
      {nowPlaying}{' '}
      {isPlaying ? (
        <button
          onClick={() => {
            player.pause();
          }}
        >
          &#9208;
        </button>
      ) : (
        <button
          onClick={() => {
            player.resume();
          }}
        >
          ▶
        </button>
      )}
    </section>
  );
};

export default Player;
