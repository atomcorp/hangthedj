import React, {useEffect, useReducer} from 'react';
import immer from 'immer';

import LoggedOut from 'components/LoggedOut/LoggedOut';
import {StorageUserType} from 'types';
import {toggleUserLoginStatus} from 'firebaseActions';

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

type AuthenticationProps = {
  children: JSX.Element;
};

const Authentication = (props: AuthenticationProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    toggleUserLoginStatus(
      (storageUser: StorageUserType) => {
        dispatch({
          type: 'auth/loggedIn',
          payload: storageUser.profilename,
        });
      },
      () => {
        dispatch({type: 'auth/loggedOut'});
      }
    );
  }, []);
  return (
    <section>
      <h3>Authentication</h3>
      {state.isGettingAuth && <div>Authenticating User...</div>}
      {!state.isGettingAuth && (state.hasAuth ? props.children : <LoggedOut />)}
    </section>
  );
};

export default Authentication;
