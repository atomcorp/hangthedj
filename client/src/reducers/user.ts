import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {StorageUserType} from 'types';

type UserState = {
  hasAuth: boolean;
} & StorageUserType;

const initialState: UserState = {
  hasAuth: false,
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
    loggedIn(state, action: PayloadAction<StorageUserType>) {
      state.hasAuth = true;
      state.email = action.payload.email;
      state.profilename = action.payload.profilename;
    },
    loggedOut(state) {
      state.hasAuth = false;
      state.email = '';
    },
  },
});

export const {loggedIn, loggedOut} = userSlice.actions;

export default userSlice.reducer;
