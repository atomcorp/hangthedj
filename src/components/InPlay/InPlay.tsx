import React, {useEffect, useReducer} from 'react';
import immer from 'immer';

import {googleSheetsType, cardsType, playersType} from 'types';

const defaultState = {
  cards: [],
  deck: [],
  stage: 'pending', // pending or picking or empty
  currentPlayerId: null,
  currentCardId: null,
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
          draft.deck.shift();
        } else {
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
          payload: {cards, defaultPlayerId: props.players[0].id},
        });
      });
  }, [props.players[0].id]);

  const nextPlayer = props.players.find(
    (player) => player.id === state.currentPlayerId
  );
  const nextCard = state.cards.find((card) => card.id === state.currentCardId);
  return (
    <section>
      {state.stage === 'pending' && (
        <div>
          Pass the phone to{' '}
          {nextPlayer ? nextPlayer.name : props.players[0].name}
          <button
            onClick={() => {
              dispatch({type: 'inplay/draw'});
            }}
          >
            Ready
          </button>
        </div>
      )}
      {state.stage === 'picking' && (
        <div>
          <div>Category: {nextCard?.category}</div>
          <h4>
            <strong>Prompt: {nextCard?.prompt}</strong>
          </h4>
        </div>
      )}
    </section>
  );
};

type propsType = {
  players: playersType;
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
    };

export default InPlay;
