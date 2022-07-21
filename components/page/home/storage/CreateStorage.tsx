import React, { useState } from 'react';
import clientHttp from 'http/client';
import { errorHandler } from 'utils';
import message from 'components/base/message';
import Form, { Field } from 'components/base/Form';
import Modal from 'components/base/Modal';
import Button from 'components/base/Button';
import Input from 'components/base/Input';
import InputByte, { ByteValue } from 'components/base/InputByte';

interface CreateStorageModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: (storage: Storage) => any;
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

export default function CreateStorageModal(props: CreateStorageModalProps) {
  const title = '创建存储';
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const handleFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      const { byteValue, ...restValues } = values;
      const capacity = byteValue.number * Math.pow(1024, byteValue.unit);
      const { data: storage } = await clientHttp.post<Storage>('/api/admin/storages', { ...restValues, capacity });
      message.success('存储创建成功');
      props.setVisible(false);
      props.onCreate(storage);
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
      <Button theme="blue" onClick={form.submit} disabled={loading}>
        确定
      </Button>
      <Button theme="blue" ghost onClick={handleClose}>
        取消
      </Button>
    </div>
  );

  return (
    <Modal title={title} visible={props.visible} footer={footer} onClose={handleClose}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={e => console.log(e)}>
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
