export const TOGGLE = 'TOGGLE';
export const ADD_TASKS = 'ADD_TASKS';
export const DELETE_TASK = 'DELETE_TASK';

export type TaskID = number;

export interface UploadTask {
  id: TaskID;
  storageID: number;
  file: File;
  progress: number;
}

export enum UploadPanelState {
  visible,
  collapse,
  invisible,
}

let id = 1;

export function toggle(state: UploadPanelState): PayloadAction<UploadPanelState> {
  return {
    type: TOGGLE,
    payload: state,
  };
}

export function addTasks(tasks: Omit<UploadTask, 'id'>[]): PayloadAction<UploadTask[]> {
  return {
    type: ADD_TASKS,
    payload: tasks.map(task => ({ id: id++, ...task })),
  };
}

export function deleteTask(taskID: TaskID): PayloadAction<TaskID> {
  return {
    type: DELETE_TASK,
    payload: taskID,
  };
}
