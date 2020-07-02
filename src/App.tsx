import React, {useReducer, useEffect} from 'react';
import immer from 'immer';

import './App.css';

import Start from 'components/Start/Start';
import Cards from 'components/Cards/Cards';

import {stateType, actionTypes, googleSheetsType, cardsType} from 'types';

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
  cards: [],
};

const reducer = (state: stateType, action: actionTypes): stateType => {
  return immer(state, (draft) => {
    switch (action.type) {
      case 'players/add':
        draft.players.push({
          name: action.payload,
          score: 0,
        });
        break;
      case 'cards/init':
        draft.cards = action.payload;
        break;
      default:
        break;
    }
  });
};

function App(): JSX.Element {
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
            });
          } else if (
            parseInt(gs$cell.col, 10) === 2 &&
            parseInt(gs$cell.row, 10) > 1
          ) {
            acc[parseInt(gs$cell.row, 10) - 2].category = gs$cell.$t;
          }
          return acc;
        }, []);
        dispatch({type: 'cards/init', payload: cards});
      });
  }, []);
  return (
    <div className="App">
      <Start players={state.players} dispatch={dispatch} />
      <Cards cards={state.cards} />
    </div>
  );
}

export default App;
