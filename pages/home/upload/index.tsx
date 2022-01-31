import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from 'store';
import { deleteTask } from '@reducers/upload';
import { layoutAdmin } from 'layout';
import UploadFileTask from 'src/home/upload/UploadFileTask';
import { withAuthServerSideProps } from 'utils/authGuard';
import { TaskID, UploadTask } from '@reducers/upload/interface';

export const getServerSideProps = withAuthServerSideProps(async () => {
  return {
    props: {
      meta: {
        title: '上传管理',
      },
    },
  };
});

interface UploadPageProps {}

const UploadPage = (props: UploadPageProps) => {
  const taskIDs = useSelector<State, TaskID[]>(state => state.upload.taskIDs);
  const taskMap = useSelector<State, Record<TaskID, UploadTask>>(state => state.upload.taskMap);
  const dispatch = useDispatch();

  const handleDeleteUploadTask = (taskID: TaskID) => {
    dispatch(deleteTask(taskID));
  };

  return (
    <div className="upload__task-list space-y-2">
      {taskIDs.map(taskID => {
        const task = taskMap[taskID];
        return <UploadFileTask key={task.id} task={task} onDelete={handleDeleteUploadTask}></UploadFileTask>;
      })}
    </div>
  );
};

export default layoutAdmin(UploadPage);
