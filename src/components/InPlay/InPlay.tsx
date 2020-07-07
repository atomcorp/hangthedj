import React, {useEffect, useReducer} from 'react';
import immer from 'immer';

import {
  googleSheetsType,
  cardsType,
  playersType,
  dispatchType,
  roundType,
} from 'types';
import css from './InPlay.module.css';

const defaultState = {
  cards: [],
  deck: [],
  stage: 'waiting', // waiting or picking or empty
  currentPlayerId: null,
  currentCardId: null,
};

const getNextPlayerId = (
  currentPlayerId: string,
  players: playersType
): string => {
  const currentPlayerIndex = players.findIndex(
    (player) => player.id === currentPlayerId
  );
  if (currentPlayerIndex + 1 === players.length) {
    return players[0].id;
  }
  return players[currentPlayerIndex + 1].id;
};

const reducer = (state: stateType, action: actionType): stateType => {
  return immer(state, (draft) => {
    switch (action.type) {
      case 'inplay/init':
        draft.cards = action.payload.cards;
        draft.deck = action.payload.cards
          .sort(() => Math.random() - 0.5)
          .map((card) => card.id);
        draft.currentPlayerId = action.payload.defaultPlayerId;
        break;
      case 'inplay/draw':
        if (state.deck.length > 0) {
          draft.stage = 'picking';
          draft.currentCardId = state.deck[0];
          draft.deck = draft.deck.filter((_, i) => i !== 0);
        } else {
          draft.stage = 'empty';
        }
        break;
      case 'inplay/endround':
        draft.stage = 'waiting';
        draft.currentPlayerId = action.payload;
        draft.currentCardId = null;
        if (state.deck.length === 0) {
          draft.stage = 'empty';
        }
        break;
      default:
        break;
    }
  });
};

const InPlay = (props: propsType): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  useEffect(() => {
    fetch(
      'https://spreadsheets.google.com/feeds/cells/1KwGMfgab2Mq0Zy8grS6fQLp8fqu9Qoikwb8qWg7OWqc/1/public/full?alt=json'
    )
      .then((res) => res.json())
      .then((res: googleSheetsType) => {
        const cards = res.feed.entry.reduce((acc: cardsType, {gs$cell}) => {
          if (
            parseInt(gs$cell.col, 10) === 1 &&
            parseInt(gs$cell.row, 10) > 1
          ) {
            acc.push({
              prompt: gs$cell.$t,
              id: gs$cell.row,
            });
          } else if (
            parseInt(gs$cell.col, 10) === 2 &&
            parseInt(gs$cell.row, 10) > 1
          ) {
            acc[parseInt(gs$cell.row, 10) - 2].category = gs$cell.$t;
          }
          return acc;
        }, []);
        dispatch({
          type: 'inplay/init',
          payload: {cards: cards, defaultPlayerId: props.players[0].id},
        });
      });
  }, [props.players[0].id]);
  const currentPlayer = props.players.find(
    (player) => player.id === state.currentPlayerId
  );
  const nextCard = state.cards.find((card) => card.id === state.currentCardId);
  return (
    <section>
      {state.stage === 'waiting' && (
        <div>
          Pass the phone to{' '}
          {currentPlayer ? currentPlayer.name : props.players[0].name}
          <br />
          <button
            onClick={() => {
              dispatch({type: 'inplay/draw'});
            }}
          >
            Ready
          </button>
        </div>
      )}
      {state.stage === 'empty' && (
        <div>
          <p>You have used all the cards</p>
          <button
            onClick={() => {
              props.appDispatch({type: 'game/end'});
            }}
          >
            Finish
          </button>
        </div>
      )}
      {state.stage === 'picking' && (
        <div>
          <p>
            Pick a song based on the prompt. When ready tell everyone the
            category and press play
          </p>
          <div>Hint: {nextCard?.category}</div>
          <h4>
            <strong>Prompt: {nextCard?.prompt}</strong>
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as HTMLFormElement;
              const data = new FormData(target);
              const result = [...data].reduce((acc, [, value]) => {
                const playerid = value as string;
                if (playerid === 'null') {
                  return acc;
                }
                if (playerid in acc) {
                  ++acc[playerid];
                } else {
                  acc[playerid] = 1;
                }
                return acc;
              }, {} as roundType);
              props.appDispatch({
                type: 'game/scores',
                payload: result,
              });
              if (state.currentPlayerId != null) {
                dispatch({
                  type: 'inplay/endround',
                  payload: getNextPlayerId(
                    state.currentPlayerId,
                    props.players
                  ),
                });
              }
            }}
          >
            <label className={css.choice} htmlFor="name">
              Artist:{' '}
              <select name="artist">
                <option value="null">-</option>
                {props.players.map((player, i) => (
                  <option key={i} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={css.choice} htmlFor="song">
              Song:{' '}
              <select name="song">
                <option value="null">-</option>
                {props.players.map((player, i) => (
                  <option key={i} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={css.choice} htmlFor="category">
              Prompt:{' '}
              <select name="category">
                <option value="null">-</option>
                {props.players.map((player, i) => (
                  <option key={i} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <button>Done</button>
          </form>
        </div>
      )}
    </section>
  );
};

type propsType = {
  players: playersType;
  appDispatch: dispatchType;
};

type stateType = {
  cards: cardsType; // remaining cardIds
  deck: string[];
  stage: string;
  currentPlayerId: null | string;
  currentCardId: null | string;
};

type actionType =
  | {
      type: 'inplay/init';
      payload: {cards: cardsType; defaultPlayerId: string};
    }
  | {
      type: 'inplay/draw';
    }
  | {
      type: 'inplay/endround';
      payload: string;
    };

export default InPlay;
