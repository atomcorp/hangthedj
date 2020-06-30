export type playersType = playerType[];

export type playerType = {
  name: string;
  score: number;
};

export type stateType = {
  players: playerType[];
};

type dispatchAddPlayer = {
  type: string;
  payload: string;
};

export type actionTypes = dispatchAddPlayer;

export type dispatchType = React.Dispatch<actionTypes>;
