import type { Reducer } from 'redux';
import { 
  TOGGLE_SIDEBAR,
  toggleSidebar,
} from './actions';


export interface AppState {
  isSidebarOpen: boolean;
}

const authInitState: AppState = {
  isSidebarOpen: false,
};

const authReducer: Reducer<AppState> = (state = authInitState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      const typedAction = action as ReturnType<typeof toggleSidebar>;
      const { payload: open } = typedAction;
      return { ...state, isSidebarOpen: open ?? !state.isSidebarOpen };

    default:
      return state;
  }
}

export default authReducer;