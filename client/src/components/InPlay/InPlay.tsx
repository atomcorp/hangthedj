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
import Scores from 'components/Scores/Scores';
import Picker from 'components/Picker/Picker';

const defaultState: stateType = {
  cards: [],
  deck: [],
  stage: 'waiting', // waiting or picking or empty
  currentPlayerId: null,
  currentCardId: null,
  hasPicked: false,
  rounds: 3,
  round: 1,
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
        draft.deck = [...action.payload.cards]
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
      case 'inplay/endturn':
        draft.stage = 'waiting';
        draft.currentPlayerId = action.payload.nextPlayerId;
        draft.currentCardId = null;
        draft.hasPicked = false;
        if (action.payload.isEndOfRound) {
          if (draft.round === state.rounds) {
            draft.stage = 'ended';
          } else {
            draft.round += 1;
          }
        }
        if (state.deck.length === 0) {
          draft.stage = 'empty';
        }

        break;
      case 'inplay/scoring':
        draft.stage = 'scoring';
        break;
      case 'inplay/skip':
        if (state.deck.length > 1) {
          const skipped = draft.deck.shift();
          if (skipped != null) {
            draft.deck.push(skipped);
            draft.currentCardId = draft.deck[0];
          }
        }
        break;
      case 'inplay/pickedsong':
        draft.hasPicked = true;
        break;
      default:
        break;
    }
  });
};

const InPlay = (props: propsType): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const defaultPlayerId = props.players[0].id;
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
          payload: {cards: cards, defaultPlayerId},
        });
      });
  }, [defaultPlayerId]);
  const currentPlayer = props.players.find(
    (player) => player.id === state.currentPlayerId
  );
  const nextCard = state.cards.find((card) => card.id === state.currentCardId);
  return (
    <section style={{flex: '1 0 auto'}}>
      <div>
        Round: {state.round}/{state.rounds}
      </div>
      <br />
      {state.stage === 'waiting' && (
        <div>
          <Scores players={props.players} />
          <p>
            Pass the phone to{' '}
            {currentPlayer
              ? `${currentPlayer.avatar} ${currentPlayer.name}`
              : `${props.players[0].avatar} ${props.players[0].name}`}
          </p>
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
          <br />

          <button
            onClick={() => {
              props.appDispatch({type: 'game/end'});
            }}
          >
            Finish
          </button>
        </div>
      )}
      {state.stage === 'ended' && (
        <div>
          <p>You have finished the game. Click to reveal the scores!</p>
          <br />

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
          <p className={css.prompt}>
            Play a song that fits the theme: <strong>{nextCard?.prompt}</strong>
          </p>
          <Picker
            handlePick={() => {
              dispatch({type: 'inplay/pickedsong'});
            }}
          />
          {nextCard?.category != null && <p>(Hint: {nextCard.category})</p>}
          <br />

          {state.deck.length > 1 && (
            <button
              onClick={() => {
                dispatch({type: 'inplay/skip'});
              }}
            >
              Skip card
            </button>
          )}
          <button
            disabled={!state.hasPicked}
            onClick={() => {
              dispatch({type: 'inplay/scoring'});
            }}
          >
            Done
          </button>
        </div>
      )}
      {state.stage === 'scoring' && (
        <>
          <p>Enter who got the correct answers</p>
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
                  type: 'inplay/endturn',
                  payload: {
                    nextPlayerId: getNextPlayerId(
                      state.currentPlayerId,
                      props.players
                    ),
                    isEndOfRound:
                      props.players.findIndex(
                        (player) => player.id === state.currentPlayerId
                      ) ===
                      props.players.length - 1,
                  },
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
                    {player.avatar} {player.name}
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
                    {player.avatar} {player.name}
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
                    {player.avatar} {player.name}
                  </option>
                ))}
              </select>
            </label>
            <br />

            <button>Done</button>
          </form>
        </>
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
  stage: 'waiting' | 'picking' | 'empty' | 'scoring' | 'ended';
  currentPlayerId: null | string;
  currentCardId: null | string;
  hasPicked: boolean;
  rounds: number;
  round: number;
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
      type: 'inplay/endturn';
      payload: {
        nextPlayerId: string;
        isEndOfRound: boolean;
      };
    }
  | {
      type: 'inplay/skip';
    }
  | {
      type: 'inplay/scoring';
    }
  | {
      type: 'inplay/pickedsong';
    };

export default InPlay;
