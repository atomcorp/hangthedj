import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {StorageUserType} from 'types';

type UserState = {
  hasAuth: boolean;
  uid: string;
} & StorageUserType;

const initialState: UserState = {
  hasAuth: false,
  uid: '',
  email: '',
  profilename: '',
  packages: [],
  spotifyAccessToken: undefined,
  spotifyRefreshToken: undefined,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<StorageUserType & {uid: string}>) {
      state.hasAuth = true;
      state.email = action.payload.email;
      state.profilename = action.payload.profilename;
      state.uid = action.payload.uid;
      state.spotifyAccessToken = action.payload.spotifyAccessToken;
      state.spotifyRefreshToken = action.payload.spotifyRefreshToken;
    },
    loggedOut(state) {
      state.hasAuth = false;
      state.email = '';
      state.profilename = '';
      state.uid = '';
      state.packages = [];
      state.spotifyAccessToken = undefined;
      state.spotifyRefreshToken = undefined;
    },
  },
});

export const {loggedIn, loggedOut} = userSlice.actions;

export default userSlice.reducer;
