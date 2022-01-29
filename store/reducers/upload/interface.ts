export type TaskID = number;

export interface UploadTask {
  id: TaskID;
  storageID: number;
  file: File;
  size: number;
  loaded: number;
}
