import type { Reducer } from 'redux';
import { TaskID, UploadTask } from './interface';
import { ADD_TASK, UPDATE_TASK, DELETE_TASK, updateTask } from './actions';
import { addTask, deleteTask } from './actions';

export interface UploadState {
  taskIDs: TaskID[];
  taskMap: Record<TaskID, UploadTask>;
}

const uploadInitState: UploadState = {
  taskIDs: [],
  taskMap: {},
};

const authReducer: Reducer<UploadState> = (state = uploadInitState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return addStateTask(state, action.payload);

    case UPDATE_TASK:
      return updateStateTask(state, action.payload);

    case DELETE_TASK:
      return deleteStateTask(state, action.payload);

    default:
      return state;
  }
};

export default authReducer;

type PayloadType<T extends (...args: any) => any> = ReturnType<T>['payload'];

function addStateTask(state: UploadState, payload: PayloadType<typeof addTask>): UploadState {
  const { taskIDs, taskMap: taskMap } = state;
  const task = payload;
  taskIDs.push(task.id);
  taskMap[task.id] = task;
  return { ...state, taskIDs, taskMap };
}

function updateStateTask(state: UploadState, payload: PayloadType<typeof updateTask>): UploadState {
  const { taskMap: _taskMap } = state;
  const { id } = payload;
  const _task = _taskMap[id];
  const taskMap = { ..._taskMap, [id]: { ..._task, ...payload } };
  console.log('update task: ', payload);
  return { ...state, taskMap };
}

function deleteStateTask(state: UploadState, payload: PayloadType<typeof deleteTask>): UploadState {
  const { taskIDs: _taskIDs, taskMap: _taskMap } = state;
  const taskID = payload;
  const taskIDs = _taskIDs.filter(id => id !== taskID);
  const taskMap = { ..._taskMap };
  delete taskMap[taskID];
  return { ...state, taskIDs, taskMap };
}
