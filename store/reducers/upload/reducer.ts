import type { Reducer } from 'redux';
import { ADD_TASKS } from '.';
import { DELETE_TASK, TOGGLE, UploadPanelState, UploadTask } from './actions';

export interface UploadState {
  state: UploadPanelState;
  tasks: UploadTask[];
}

const uploadInitState: UploadState = {
  state: UploadPanelState.collapse,
  tasks: [],
};

const authReducer: Reducer<UploadState> = (state = uploadInitState, action) => {
  switch (action.type) {
    case TOGGLE:
      return { ...state, state: action.payload };

    case ADD_TASKS:
      return { ...state, tasks: [...state.tasks, ...action.payload] };

    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };

    default:
      return state;
  }
};

export default authReducer;
