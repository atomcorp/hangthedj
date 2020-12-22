import firebase from 'firebase/app';

import {StorageUserType} from 'types';

export const createUser = async (
  password: string,
  email: string,
  profilename: string
): Promise<void> => {
  // 1. create user in Firebase Auth
  const {user} = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  if (user) {
    // 2. create user in Firebase database, using Auth Id
    const storageUser = await firebase.database().ref(`users/${user.uid}`).set({
      email: email,
      profilename: profilename,
      packages: [],
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
    });
    // log user in
    if (storageUser) {
      firebase.auth().signInWithEmailAndPassword(email, password);
    }
  }
};

export const toggleUserLoginStatus = (): ((
  loginCallback: (user: StorageUserType) => void,
  logoutCallback: () => void,
  done: () => void
) => void) => {
  const state: {
    loginCallback: null | ((user: StorageUserType) => void);
    logoutCallback: null | (() => void);
    isInit: boolean;
    done: null | (() => void);
  } = {
    loginCallback: null,
    logoutCallback: null,
    isInit: false,
    done: null,
  };
  return (
    loginCallback: (user: StorageUserType) => void,
    logoutCallback: () => void,
    done: () => void
  ) => {
    state.loginCallback = loginCallback;
    state.logoutCallback = logoutCallback;
    state.done = done;
    if (!state.isInit) {
      state.isInit = true;
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
            if (state.loginCallback != null) {
              state.loginCallback(storageUser);
            }
          } else {
            if (state.logoutCallback != null) {
              state.logoutCallback();
            }
          }
          // ...
        } else {
          // User is signed out
          // ...
          if (state.logoutCallback != null) {
            state.logoutCallback();
          }
        }
        if (state.done != null) {
          state.done();
        }
      });
    }
  };
};
