import React from 'react';
import Button from 'components/base/Button';
import Progress from 'components/base/Progress';
import { formatBytes } from 'utils';
import { TaskID, UploadTask } from '@reducers/upload/interface';

interface UploadFileTaskProps {
  task: UploadTask;
  onDelete?: (taskID: TaskID) => void;
}

export default function UploadFile(props: UploadFileTaskProps) {
  const { task } = props;
  const progress = Math.floor((task.loaded / task.size) * 100);
  const loading = task.loaded < task.size;

  return (
    <div className="upload__task flex flex-row p-4 bg-white border rounded-lg border-indigo-200">
      <div className="task__icon">
        <div className="rounded-full bg-slate-400 w-12 h-12"></div>
      </div>
      <div className="task__desc flex-1 flex flex-col mx-4">
        <div className="desc__name">{task.file.name}</div>
        <div className="desc__size">{formatBytes(task.file.size)}</div>
        <div className="desc__progress">
          <Progress percent={progress}></Progress>
        </div>
      </div>
      <div className="task__operation">
        <Button disabled={loading} onClick={() => props.onDelete?.(task.id)}>
          {loading ? '正在上传' : '删除'}
        </Button>
      </div>
    </div>
  );
}
