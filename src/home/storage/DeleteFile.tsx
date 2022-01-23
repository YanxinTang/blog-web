import React, { useCallback, useState } from 'react';
import clientHttp from 'http/client';
import Modal, { ModalBaseProps } from 'components/Modal';
import Button from '@components/Button';
import { errorHandler } from '@util';
import message from '@components/message';

interface DeleteFileProps extends ModalBaseProps {
  storageID: number;
  file: FileObject | null;
  onDelete: (file: FileObject) => void;
}

export default function DeleteFile(props: DeleteFileProps) {
  const title = '删除文件';
  const [loading, setLoading] = useState(false);
  const {
    file,
    storageID,
    onDelete,
    visibleState: [visible, setVisible],
  } = props;

  const handleFinish = useCallback(async () => {
    if (!file) {
      return;
    }
    try {
      setLoading(true);
      await clientHttp.delete<Storage>(`/api/admin/storages/${storageID}/object`, {
        params: { key: file.Key },
      });
      message.success('文件删除成功');
      setVisible(false);
      onDelete(file);
    } catch (error) {
      message.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  }, [storageID, file, onDelete, setVisible]);

  const handleClose = () => {
    setVisible(false);
  };

  const footer = (
    <div className="space-x-2">
      <Button type="blue" onClick={handleFinish} disabled={loading}>
        确定
      </Button>
      <Button type="blue" ghost onClick={handleClose}>
        取消
      </Button>
    </div>
  );

  return (
    <Modal title={title} visible={visible} footer={footer} onClose={handleClose}>
      <p>确定要删除「{props?.file?.Key}」，此操作将不可恢复？</p>
    </Modal>
  );
}
