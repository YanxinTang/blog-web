import React, { useEffect, useState } from 'react';
import clientHttp from 'http/client';
import Button from 'components/Button';
import Progress from 'components/Progress';
import { errorHandler, formatBytes } from 'utils';
import message from 'components/message';
import { TaskID } from '@reducers/upload';

interface UploadFileTaskProps {
  taskID: TaskID;
  storageID: number;
  file: File;
  onDelete?: (taskID: TaskID) => void;
}

export default function UploadFile(props: UploadFileTaskProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { taskID } = props;

  useEffect(() => {
    const { file, storageID } = props;
    (async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await clientHttp.put(`/api/admin/storages/${storageID}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress(progressEvent: ProgressEvent<XMLHttpRequestUpload>) {
            const { total, loaded } = progressEvent;
            setProgress(Math.floor((loaded / total) * 100));
          },
        });
      } catch (error) {
        message.error(errorHandler(error));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="upload__task flex flex-row p-4 bg-white border rounded-lg border-indigo-200">
      <div className="task__icon">
        <div className="rounded-full bg-slate-400 w-12 h-12"></div>
      </div>
      <div className="task__desc flex-1 flex flex-col mx-4">
        <div className="desc__name">{props.file.name}</div>
        <div className="desc__size">{formatBytes(props.file.size)}</div>
        <div className="desc__progress">
          <Progress percent={progress}></Progress>
        </div>
      </div>
      <div className="task__operation">
        <Button disabled={loading} onClick={() => props.onDelete?.(taskID)}>
          {loading ? '正在上传' : '删除'}
        </Button>
      </div>
    </div>
  );
}
