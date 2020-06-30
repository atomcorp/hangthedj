import React from 'react';

import {playersType, dispatchType} from 'types';

const Start = (props: propTypes): JSX.Element => {
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
                props.dispatch({
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
        {props.players.map((player, i) => (
          <div key={i}>
            {player.name} ({player.score})
          </div>
        ))}
      </section>
    </section>
  );
};

type propTypes = {
  players: playersType;
  dispatch: dispatchType;
};

export default Start;
