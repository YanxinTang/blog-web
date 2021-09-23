import { combineReducers } from 'redux';
import app from './app/reducer';
import auth from './auth/reducer';

// COMBINED REDUCERS
const reducers = {
  auth,
  app,
}

export default combineReducers(reducers)