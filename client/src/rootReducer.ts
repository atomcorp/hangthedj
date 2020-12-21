import {combineReducers} from '@reduxjs/toolkit';

import authSlice from 'reducers/auth';

const rootReducer = combineReducers({
  authSlice,
});

export default rootReducer;
