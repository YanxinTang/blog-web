import { ThunkAction } from 'redux-thunk';
import clientHttp from 'http/client';
import { TaskID, UploadTask } from './interface';
import { AnyAction } from 'redux';
import { UploadState } from '.';

export const ADD_TASK = 'ADD_TASK';
export const ADD_TASKS = 'ADD_TASKS';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

let id = 1;

export function uploadFile(storageID: number, file: File): ThunkAction<void, UploadState, unknown, AnyAction> {
  return async (dispatch, getState) => {
    const addTaskAction = addTask({ storageID, file, size: file.size, loaded: 0 });
    dispatch(addTaskAction);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await clientHttp.put(`/api/admin/storages/${storageID}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent: ProgressEvent<XMLHttpRequestUpload>) {
          const { total, loaded } = progressEvent;
          // setProgress(Math.floor((loaded / total) * 100));
          dispatch(updateTask({ id: addTaskAction.payload.id, loaded }));
        },
      });
    } catch (error) {
      // message.error(errorHandler(error));
    } finally {
      // setLoading(false);
    }
  };
}

export function addTask(task: Omit<UploadTask, 'id'>): PayloadAction<UploadTask> {
  return {
    type: ADD_TASK,
    payload: { id: id++, ...task },
  };
}

export function updateTask(task: AtLeast<UploadTask, 'id'>): PayloadAction<AtLeast<UploadTask, 'id'>> {
  return {
    type: UPDATE_TASK,
    payload: task,
  };
}

export function deleteTask(taskID: TaskID): PayloadAction<TaskID> {
  return {
    type: DELETE_TASK,
    payload: taskID,
  };
}
