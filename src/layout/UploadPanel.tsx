import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/Button';
import { State } from 'store';
import { deleteTask, TaskID, toggle, UploadPanelState, UploadTask } from '@reducers/upload';
import { mergeClassNames } from 'utils';
import UploadFileTask from 'src/home/storage/UploadFileTask';

export default function UploadPanel() {
  const tasks = useSelector<State, UploadTask[]>(state => state.upload.tasks);
  const dispatch = useDispatch();
  const uploadPanelState = useSelector<State, UploadPanelState>(state => state.upload.state);

  const uploadPanelStyle: React.CSSProperties = {
    transform:
      uploadPanelState === UploadPanelState.invisible
        ? 'translateY(100%)'
        : uploadPanelState === UploadPanelState.collapse
        ? 'translateY(calc(100% - 3rem))'
        : '',
  };

  const handleUploadPanelCollapse = () => {
    const newState =
      uploadPanelState === UploadPanelState.collapse ? UploadPanelState.visible : UploadPanelState.collapse;
    dispatch(toggle(newState));
  };

  const handleUploadPanelInvisible = () => {
    dispatch(toggle(UploadPanelState.invisible));
  };

  const handleDeleteUploadTask = (taskID: TaskID) => {
    dispatch(deleteTask(taskID));
  };

  return (
    <div
      className={mergeClassNames(
        'absolute left-0 right-0 bg-white top-8 bottom-0 z-30 box-border rounded-t-xl mx-2 transition'
      )}
      style={uploadPanelStyle}
    >
      <div className="header flex flex-row items-center h-12 border-b p-4 rounded-t-xl">
        <div className="header__center flex-1 flex justify-center ">
          <button className="w-12 h-4 rounded-full bg-gray-400" onClick={handleUploadPanelCollapse}></button>
        </div>
        <div className="header__right">
          <Button ghost onClick={handleUploadPanelInvisible}>
            X
          </Button>
        </div>
      </div>
      <div className="body p-4">
        <div className="upload__task-list space-y-2">
          {tasks.map(task => {
            return (
              <UploadFileTask
                key={task.id}
                taskID={task.id}
                file={task.file}
                storageID={task.storageID}
                onDelete={handleDeleteUploadTask}
              ></UploadFileTask>
            );
          })}
        </div>
      </div>
    </div>
  );
}
