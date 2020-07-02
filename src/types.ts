export type playersType = playerType[];
export type cardsType = cardType[];

export type playerType = {
  name: string;
  score: number;
};

export type cardType = {
  prompt: string;
  category?: string;
};

export type stateType = {
  players: playerType[];
  cards: cardType[];
};

export type actionTypes =
  | {type: 'players/add'; payload: string}
  | {type: 'cards/init'; payload: cardsType};

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
