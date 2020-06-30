import React, {useReducer} from 'react';
import immer from 'immer';

const defaultState = {
  players: [
    {
      name: 'Tom',
      score: 0,
    },
    {
      name: 'Amy',
      score: 0,
    },
  ],
};

const reducer = (state: stateType, action: actionType): stateType => {
  return immer(state, (draft) => {
    switch (action.type) {
      case 'players/add':
        draft.players.push({
          name: action.payload,
          score: 0,
        });
        break;
      default:
        break;
    }
  });
};

const Start = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <section>
      <h1>Amy and Tom&apos;s game</h1>
      <section>
        <h2>Add players</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const data = new FormData(target);
            for (const pair of data) {
              if (pair[0] === 'name') {
                dispatch({
                  type: 'players/add',
                  payload: pair[1] as string,
                });
              }
            }
          }}
        >
          <input name="name" type="text" placeholder="Write name" />
          <input type="submit" value="Add"></input>
        </form>
      </section>

      <section>
        {state.players.map((player, i) => (
          <div key={i}>
            {player.name} ({player.score})
          </div>
        ))}
      </section>
    </section>
  );
};

type playerType = {
  name: string;
  score: number;
};

type stateType = {
  players: playerType[];
};

type dispatchAddPlayer = {
  type: string;
  payload: string;
};

type actionType = dispatchAddPlayer;

export default Start;
