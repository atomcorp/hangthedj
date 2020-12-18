import React, {useEffect, useReducer} from 'react';
import firebase from 'firebase/app';
import immer from 'immer';

import LoggedOut from 'components/LoggedOut/LoggedOut';
import {StorageUserType} from 'types';

type StateType = {
  isGettingAuth: boolean;
  hasAuth: boolean;
  displayname: string;
};

type actionTypes =
  | {type: 'auth/loggedIn'; payload: string}
  | {type: 'auth/loggedOut'};

const initialState = {
  isGettingAuth: true,
  hasAuth: false,
  displayname: '',
};

const reducer = (state: StateType, action: actionTypes): StateType => {
  return immer(state, (draftState: StateType) => {
    switch (action.type) {
      case 'auth/loggedIn':
        draftState.isGettingAuth = false;
        draftState.hasAuth = true;
        draftState.displayname = action.payload;
        break;
      case 'auth/loggedOut':
        draftState.isGettingAuth = false;
        draftState.hasAuth = false;
        draftState.displayname = '';
        break;
      default:
        break;
    }
  });
};

const Authentication = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const snapshot = await firebase
          .database()
          .ref('/users/' + authUser.uid)
          .once('value');
        const storageUser = snapshot.val() as StorageUserType | null;
        if (storageUser != null) {
          dispatch({
            type: 'auth/loggedIn',
            payload: storageUser.profilename,
          });
        } else {
          dispatch({type: 'auth/loggedOut'});
        }
        // ...
      } else {
        // User is signed out
        // ...
        console.log('Signed out');
        dispatch({type: 'auth/loggedOut'});
      }
    });
  }, []);
  return (
    <section>
      <h3>Authentication</h3>
      <button
        type="button"
        onClick={() => {
          firebase
            .database()
            .ref('users/' + 'WHZvhw4guSM2zWniXo18qQpXiy52')
            .set({
              email: 'thomasmaxwellsmith+admin@gmail.com',
              profilename: 'Tom',
              packages: [],
              spotifyAccessToken: null,
              spotifyRefreshToken: null,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        Create user in storage
      </button>
      {state.isGettingAuth && <div>Authenticating User...</div>}
      {!state.isGettingAuth &&
        (state.hasAuth ? (
          <div>
            <h3>Hello {state.displayname}</h3>
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
            <LoggedOut />
          </div>
        ))}
    </section>
  );
};

export default Authentication;
