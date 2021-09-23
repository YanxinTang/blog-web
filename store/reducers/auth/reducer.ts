import type { Reducer } from 'redux';
import { SIGNIN, SIGNOUT } from './actions';

export interface AuthState {
  user: User | null;
}

const authInitState: AuthState = {
  user: null,
};

const authReducer: Reducer<AuthState> = (state = authInitState, action) => {
  switch (action.type) {
    case SIGNIN:
      return { ...state, user: action.payload };

    case SIGNOUT:
      return { ...state, user: null}

    default:
      return state;
  }
}

export default authReducer;