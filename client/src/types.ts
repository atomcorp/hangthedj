type StoragePackageId = string;

export type AuthUserType = {
  email: string;
  profilename: string;
  password: string;
};

export type StorageUserType = {
  email: string;
  profilename: string;
  packages: StoragePackageId[] | undefined;
  spotifyRefreshToken: undefined | string;
};

type PackageCategoryId = string;
type PackageCategoryOptionId = string;

export type PackageCategoryOptions = {
  id: PackageCategoryOptionId;
  name: string;
  visible: boolean;
};

export type PackageCategory = {
  id: PackageCategoryId;
  name: string; // eg Decade, Dance craze, Covers etc
  options: PackageCategoryOptionId[];
  description: string;
  visible: boolean;
};

export type Package = {
  name: string; // eg Hard, Easy, Rap etc
  id: string;
  categories: PackageCategoryId[];
  visible: boolean;
};

//
//
//
//
//
//
//
// OLD
//
//
//
//
//
//
//

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
  play: (spotify_uri: string) => void;
  pause: () => void;
  resume: () => void;
  isPlaying: boolean;
  setIsPlayingListener: (
    callback: (bool: boolean, nowPlaying: string | null) => void
  ) => void;
  isPlayingListener:
    | null
    | ((bool: boolean, nowPlaying: string | null) => void);
  hasPickedTrack: boolean;
  togglePickedTrack: () => void;
};
