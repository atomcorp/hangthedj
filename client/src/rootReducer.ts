import {combineReducers} from '@reduxjs/toolkit';

import userSlice from 'reducers/user';

const rootReducer = combineReducers({
  user: userSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
