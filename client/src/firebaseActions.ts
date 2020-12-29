import firebase from 'firebase/app';

import {StorageUserType} from 'types';

export const createUser = async (
  password: string,
  email: string,
  profilename: string
): Promise<void> => {
  try {
    // 1. create user in Firebase Auth
    const {user} = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    if (user) {
      // 2. create user in Firebase database, using Auth Id
      await firebase
        .database()
        .ref(`users/${user.uid}`)
        .set(
          {
            email: email,
            profilename: profilename,
            packages: [],
            spotifyAccessToken: null,
            spotifyRefreshToken: null,
          },
          (error) => {
            if (!error) {
              firebase.auth().signInWithEmailAndPassword(email, password);
            } else {
              throw new Error('Storage user creationg failed');
            }
          }
        );
      // log user in
    } else {
      throw new Error('System user creationg failed');
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const toggleUserLoginStatus = (): ((
  loginCallback: (user: StorageUserType, uid: string) => void,
  logoutCallback: () => void,
  done: () => void
) => void) => {
  const state: {
    loginCallback: null | ((user: StorageUserType, uid: string) => void);
    logoutCallback: null | (() => void);
    isInit: boolean;
    done: null | (() => void);
  } = {
    loginCallback: null,
    logoutCallback: null,
    isInit: false,
    done: null,
  };
  return (loginCallback, logoutCallback, done) => {
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
              state.loginCallback(storageUser, authUser.uid);
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

const testDevices = (spotifyToken: string): void => {
  fetch('https://api.spotify.com/v1/me/player/devices', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${spotifyToken}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw await res.json();
      }
    })
    .then((res) => {
      console.log(res);
    })
    .catch((res: {error: {status: number; message: string}}) => {
      console.log(res.error.message);
    });
};

export const makeSpotifyRequest = async (tries?: number): Promise<void> => {
  try {
    const spotifyAccessTokenExpiresIn = localStorage.getItem(
      'spotifyAccessTokenExpiresIn'
    );
    if (
      spotifyAccessTokenExpiresIn &&
      new Date(spotifyAccessTokenExpiresIn).getTime() > new Date().getTime()
    ) {
      // token is fresh, should be OK
      const spotifyAccessToken = localStorage.getItem('spotifyAccessToken');
      if (spotifyAccessToken) {
        // need another check here if the token fails
        testDevices(spotifyAccessToken);
      }
    } else {
      // request a new accessToken using the refresh token, and try again (3x)
      const currentUser = firebase.auth().currentUser;
      const snapshot = await firebase
        .database()
        .ref('/users/' + currentUser?.uid)
        .once('value');
      const storageUser = snapshot.val() as StorageUserType | null;
      if (storageUser) {
        const response = await fetch('/api/v1/refreshspotifytoken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spotifyRefreshToken: storageUser.spotifyRefreshToken,
          }),
        });
        if (response.status === 200) {
          const tokens = (await response.json()) as {
            spotifyAccessToken: string;
            spotifyAccessTokenExpiresIn: string;
          };
          localStorage.setItem('spotifyAccessToken', tokens.spotifyAccessToken);
          localStorage.setItem(
            'spotifyAccessTokenExpiresIn',
            tokens.spotifyAccessTokenExpiresIn
          );
          if (tries == null || tries < 3) {
            tries = tries == null ? 1 : ++tries;
            makeSpotifyRequest(tries);
          }
        } else {
          throw new Error(response.statusText);
        }
      }
    }
  } catch (error) {
    console.error('makeSpotifyRequest (func): ', error);
  }
};

export const signOut = (): void => {
  firebase.auth().signOut();
  localStorage.removeItem('spotifyAccessToken');
  localStorage.removeItem('spotifyAccessTokenExpiresIn');
};
