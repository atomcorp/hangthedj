import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AuthState = {
  hasAuth: boolean;
};

const initialState: AuthState = {
  hasAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.hasAuth = action.payload;
    },
  },
});

export const {setAuth} = authSlice.actions;

export default authSlice.reducer;
