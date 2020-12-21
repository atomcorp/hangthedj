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

export const toggleUserLoginStatus = (
  loginCallback: (user: StorageUserType) => void,
  logoutCallback: () => void
): void => {
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
        loginCallback(storageUser);
      } else {
        logoutCallback();
      }
      // ...
    } else {
      // User is signed out
      // ...
      logoutCallback();
    }
  });
};
