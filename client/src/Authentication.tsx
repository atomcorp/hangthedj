import React, {useEffect, useReducer} from 'react';
import firebase from 'firebase/app';
import immer from 'immer';

import LogIn from 'components/LogIn/LogIn';

type StateType = {
  isGettingAuth: boolean;
  hasAuth: boolean;
};

type actionTypes = {type: 'auth/get'; payload: boolean};

const initialState = {
  isGettingAuth: true,
  hasAuth: false,
};

const reducer = (state: StateType, action: actionTypes): StateType => {
  return immer(state, (draftState: StateType) => {
    switch (action.type) {
      case 'auth/get':
        draftState.isGettingAuth = false;
        draftState.hasAuth = action.payload;
        break;
      default:
        break;
    }
  });
};

const Authentication = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);
        dispatch({type: 'auth/get', payload: true});
        // ...
      } else {
        // User is signed out
        // ...
        console.log('Signed out');
        dispatch({type: 'auth/get', payload: false});
      }
    });
  }, []);
  return (
    <section>
      <h3>Authentication</h3>
      {state.isGettingAuth && <div>Authenticating User...</div>}
      {!state.isGettingAuth &&
        (state.hasAuth ? (
          <div>
            <button
              type="button"
              onClick={() => {
                firebase.auth().signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <LogIn />
          </div>
        ))}
    </section>
  );
};

export default Authentication;
