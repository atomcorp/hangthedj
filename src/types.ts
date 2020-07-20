export type playersType = playerType[];
export type cardsType = cardType[];

export type playerType = {
  name: string;
  score: number;
  id: string;
  avatar: string;
};

export type cardType = {
  prompt: string;
  category?: string;
  id: string;
};

export type gameStateType = 'start' | 'inplay' | 'finished';

export type stateType = {
  players: playerType[];
  gameState: gameStateType;
};

export type roundType = {
  [id: string]: number;
};

export type actionTypes =
  | {type: 'players/add'; payload: {name: string; id: string; avatar: string}}
  | {type: 'game/start'}
  | {
      type: 'game/scores';
      payload: roundType;
    }
  | {type: 'game/end'}
  | {
      type: 'game/restart';
      payload: stateType;
    };

export type dispatchType = React.Dispatch<actionTypes>;

export type googleSheetsType = {
  feed: {
    entry: {
      gs$cell: {
        $t: string;
        row: string;
        col: string;
      };
    }[];
  };
};

// this is missing in the @types/spotify-web-playback-sdk
export type SpotifyOptionsType = {
  _options: {
    name: string;
    getOAuthToken(cb: (token: string) => void): void;
    volume?: number;
    id: string;
  };
};

export type playerRefType = {
  player: null | (Spotify.SpotifyPlayer & SpotifyOptionsType);
  token: string | null;
  play: () => void;
};
