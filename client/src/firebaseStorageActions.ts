import firebase from 'firebase/app';

const addUser = (
  userId: string,
  name: string,
  email: string,
  profilename: string
): void => {
  firebase
    .database()
    .ref('users/' + userId)
    .set({
      name,
      email,
      profilename,
      packages: [],
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
    });
};
