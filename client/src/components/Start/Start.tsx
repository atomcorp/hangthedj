import React, {useState} from 'react';

import Scores from 'components/Scores/Scores';
import {getId, avatarUtils} from 'utils';

import {playersType, dispatchType} from 'types';
import css from './Start.module.css';

const Start = (props: propTypes): JSX.Element => {
  const [name, setName] = useState('');
  return (
    <section>
      <fieldset>
        <legend>Add players</legend>
        <form
          className={css.addnew}
          onSubmit={(e) => {
            e.preventDefault();
            setName('');
            props.dispatch({
              type: 'players/add',
              payload: {
                name,
                id: getId(),
                avatar: avatarUtils.get(),
              },
            });
          }}
        >
          <input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const val = event.target.value;
              if (val) {
                setName(val);
              }
            }}
            value={name}
            name="name"
            type="text"
            placeholder="Write name"
          />
          <button>Add</button>
        </form>
      </fieldset>

      <section>
        <Scores players={props.players} />
      </section>
      <br />
      <section>
        <button
          disabled={props.players.length < 1}
          onClick={() => {
            props.dispatch({type: 'game/start'});
          }}
        >
          Start
        </button>
      </section>
    </section>
  );
};

type propTypes = {
  players: playersType;
  dispatch: dispatchType;
};

export default Start;
