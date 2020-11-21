import React, {useEffect, useState} from 'react';

import player from 'spotifyInterface';

const Player = (): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (player.setIsPlayingListener != null) {
      player.setIsPlayingListener((bool: boolean) => {
        setIsPlaying(bool);
      });
    }
  }, []);
  return (
    <section>
      {isPlaying ? 'playing' : 'no playing'}
      <button
        onClick={() => {
          player.play('spotify:track:7xGfFoTpQ2E7fRF5lN10tr');
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          player.pause();
        }}
      >
        Pause
      </button>
    </section>
  );
};

export default Player;
