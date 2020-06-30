import React, {useReducer, useEffect} from 'react';
import immer from 'immer';

import './App.css';

import Start from 'components/Start/Start';

import {stateType, actionTypes} from 'types';

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

const reducer = (state: stateType, action: actionTypes): stateType => {
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

type googleSheetsType = {
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

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, defaultState);
  useEffect(() => {
    fetch(
      'https://spreadsheets.google.com/feeds/cells/1KwGMfgab2Mq0Zy8grS6fQLp8fqu9Qoikwb8qWg7OWqc/1/public/full?alt=json'
    )
      .then((res) => res.json())
      .then((res: googleSheetsType) => {
        console.log(
          res.feed.entry.map(({gs$cell}) => ({
            name: gs$cell.$t,
            row: gs$cell.row,
            ccolel: gs$cell.col,
          }))
        );
      });
  }, []);
  return (
    <div className="App">
      <Start players={state.players} dispatch={dispatch} />
    </div>
  );
}

export default App;
