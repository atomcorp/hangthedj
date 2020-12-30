import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {StorageUserType} from 'types';

type UserState = {
  hasAuth: boolean;
  email: string;
  profilename: string;
  packages: string[] | undefined;
};

const initialState: UserState = {
  hasAuth: false,
  email: '', // TODO: remove this, should probably just request if needed
  profilename: '',
  packages: [], // TODO: remove this, should probably just request if needed
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
      state.profilename = '';
      state.packages = [];
    },
  },
});

export const {loggedIn, loggedOut} = userSlice.actions;

export default userSlice.reducer;
