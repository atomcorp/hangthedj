import React, {useReducer} from 'react';
import immer from 'immer';
import {useLocation, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {loggedIn, loggedOut} from 'reducers/user';
import {StorageUserType} from 'types';
import {RootState} from 'rootReducer';
import {toggleUserLoginStatus} from 'firebaseActions';
import {useState} from 'react';

type locationType = {
  from?: {pathname: string};
};

type AuthenticationProps = {
  children: JSX.Element;
};

const memoToggleUserLoginStatus = toggleUserLoginStatus();

const Authentication = (props: AuthenticationProps): JSX.Element => {
  const [isGettingAuth, setGettingAuth] = useState(true);
  const history = useHistory();
  const location = useLocation<locationType>();
  const hasAuth = useSelector((state: RootState) => state.user.hasAuth);
  const reduxDispatch = useDispatch();
  memoToggleUserLoginStatus(
    (storageUser: StorageUserType) => {
      reduxDispatch(loggedIn(storageUser));
      if (location.state?.from?.pathname) {
        history.push(location.state?.from?.pathname);
      }
    },
    () => {
      reduxDispatch(loggedOut());
    },
    () => {
      setGettingAuth(false);
    }
  );
  return (
    <>
      {!hasAuth && isGettingAuth ? (
        <div style={{background: 'red'}}>Authenticating User...</div>
      ) : (
        props.children
      )}
    </>
  );
};

export default Authentication;
