import React, { useState } from 'react';
import clientHttp from 'http/client';
import { errorHandler } from 'utils';
import message from 'components/message';
import Form, { Field } from 'components/Form';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import InputByte, { ByteValue } from 'components/InputByte';

interface EditStorageModalProps {
  storage: Storage;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (storage: Storage) => any;
}

interface FormValues {
  name: string;
  secretID: string;
  secretKey: string;
  token: string;
  region: string;
  endpoint: string;
  bucket: string;
  byteValue: ByteValue;
}

export default function EditStorageModal(props: EditStorageModalProps) {
  const title = '编辑存储';
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const { capacity, ...restInitValues } = props.storage;
  const initFormValues: FormValues = { byteValue: InputByte.parseByteValue(capacity), ...restInitValues };

  const handleFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      const { byteValue, ...restValues } = values;
      const capacity = byteValue.number * Math.pow(1024, byteValue.unit);
      const { data: storage } = await clientHttp.put<Storage>(`/api/admin/storages/${props.storage.id}`, {
        ...restValues,
        capacity,
      });
      message.success('存储编辑成功');
      props.setVisible(false);
      props.onEdit(storage);
    } catch (error) {
      message.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    props.setVisible(false);
    form.resetFields();
  };

  const footer = (
    <div className="space-x-2">
      <Button type="blue" onClick={form.submit} disabled={loading}>
        确定
      </Button>
      <Button type="blue" ghost onClick={handleClose}>
        取消
      </Button>
    </div>
  );

  return (
    <Modal title={title} visible={props.visible} footer={footer} onClose={handleClose}>
      <Form form={form} onFinish={handleFinish} initialValues={initFormValues}>
        <Field name="name" label="名称" rules={[{ required: true }]}>
          <Input placeholder="名称"></Input>
        </Field>
        <Field name="secretID" label="Secret ID" rules={[{ required: true }]}>
          <Input placeholder="Secret ID"></Input>
        </Field>
        <Field name="secretKey" label="Secret Key" rules={[{ required: true }]}>
          <Input placeholder="Secret Key"></Input>
        </Field>
        <Field name="token" label="Token">
          <Input placeholder="Token"></Input>
        </Field>
        <Field name="region" label="区域" rules={[{ required: true }]}>
          <Input placeholder="区域"></Input>
        </Field>
        <Field name="endpoint" label="终端" rules={[{ required: true }]}>
          <Input placeholder="终端"></Input>
        </Field>
        <Field name="bucket" label="桶" rules={[{ required: true }]}>
          <Input placeholder="桶"></Input>
        </Field>
        <Field name="byteValue" label="容量" rules={[{ required: true, type: 'object' }]}>
          <InputByte placeholder="容量"></InputByte>
        </Field>
      </Form>
    </Modal>
  );
}
