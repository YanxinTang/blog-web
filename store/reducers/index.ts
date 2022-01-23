import { combineReducers } from 'redux';
import app from './app/reducer';
import auth from './auth/reducer';
import upload from './upload/reducer';

// COMBINED REDUCERS
const reducers = {
  auth,
  app,
  upload,
};

export default combineReducers(reducers);
