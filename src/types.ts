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
  | {type: 'players/add'; payload: string}
  | {type: 'game/start'}
  | {
      type: 'game/scores';
      payload: roundType;
    }
  | {type: 'game/end'};

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
