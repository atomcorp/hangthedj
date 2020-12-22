import React from 'react';
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
    (storageUser: StorageUserType, uid: string) => {
      reduxDispatch(loggedIn({uid, ...storageUser}));
      if (location.state?.from?.pathname) {
        history.push(location.state?.from?.pathname);
      } else if (location.pathname !== '/play/redirect') {
        history.push('/play');
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
