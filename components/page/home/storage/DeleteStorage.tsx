import React, { useState } from 'react';
import clientHttp from 'http/client';
import { errorHandler } from 'utils';
import message from 'components/base/message';
import Modal from 'components/base/Modal';
import Button from 'components/base/Button';

interface AddStorageModalProps {
  storage: Storage;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: Storage['id']) => any;
}

export default function EditStorageModal(props: AddStorageModalProps) {
  const title = '删除存储';
  const [loading, setLoading] = useState(false);
  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      await clientHttp.delete<Storage>(`/api/admin/storages/${props.storage.id}`);
      message.success('存储删除成功');
      props.setVisible(false);
      props.onDelete(props.storage.id);
    } catch (error) {
      message.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    props.setVisible(false);
  };

  const footer = (
    <div className="space-x-2">
      <Button theme="blue" onClick={handleFinish} disabled={loading}>
        确定
      </Button>
      <Button theme="blue" ghost onClick={handleClose}>
        取消
      </Button>
    </div>
  );

  return (
    <Modal title={title} visible={props.visible} footer={footer} onClose={handleClose}>
      <p>确定要删除「{props.storage.name}」，此操作将不可恢复？</p>
    </Modal>
  );
}
