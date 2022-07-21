import React, { useState } from 'react';
import Link from 'next/link';
import { layoutAdmin } from 'layout';
import { formatBytes, withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';
import Button from 'components/base/Button';
import CreateModal from 'components/page/home/storage/CreateStorage';
import EditModal from 'components/page/home/storage/EditStorage';
import DeleteModal from 'components/page/home/storage/DeleteStorage';
import Icon from 'components/base/Icon';
import PopConfirm from 'components/base/PopConfirm';

type GetStoragesResponse = Storage[];

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { data } = await newHttp(ctx).get<GetStoragesResponse>('/api/admin/storages');
  return {
    props: {
      data,
      meta: {
        title: '存储管理',
      },
    },
  };
});

interface ItemProps {
  storage: Storage;
  onChange: (storage: Storage) => any;
  onDelete: (storage: Storage) => any;
}

const Item = (props: ItemProps) => {
  const { storage } = props;

  return (
    <tr>
      <td className="px-6 py-4 text-overflow-ellipsis">
        <Link href={`/home/storages/${storage.id}`} passHref>
          {storage.name}
        </Link>
      </td>
      <td className="hidden md:table-cell px-6 py-4">{storage.bucket}</td>
      <td className="px-6 py-4">{formatBytes(storage.capacity)}</td>
      <td className="px-6 py-4 whitespace-nowrap space-x-2">
        <Button theme="indigo" ghost title="编辑" onClick={() => props.onChange(storage)}>
          <Icon id="pencil" />
        </Button>
        <PopConfirm title={`确定要删除${props.storage.name}吗？`}>
          <Button theme="red" ghost title="删除" onClick={() => props.onDelete(storage)}>
            <Icon id="trash" />
          </Button>
        </PopConfirm>
      </td>
    </tr>
  );
};

interface CategoriesProps {
  data: GetStoragesResponse;
}

const genEmptyStorage = (): Storage => {
  return {} as Storage;
};

function Storages(props: CategoriesProps) {
  const { data } = props;
  const [storages, setStorages] = useState(data);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editStorage, setEditStorage] = useState<Storage>(() => genEmptyStorage());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStorage, setDeleteStorage] = useState<Storage>(() => genEmptyStorage());

  const handleCreate = (storage: Storage) => {
    setStorages(storages => [...storages, storage]);
  };

  const handleEditStorage = (storage: Storage) => {
    setStorages(storages => {
      const copied = [...storages];
      const idx = copied.findIndex(item => item.id === storage.id);
      copied[idx] = storage;
      return copied;
    });
  };

  const handleDeleteStorage = (id: Storage['id']) => {
    setStorages(storages => storages.filter(s => s.id !== id));
  };

  const handleChange = (storage: Storage) => {
    setEditStorage(storage);
    setEditModalVisible(true);
  };

  const handleDelete = (storage: Storage) => {
    setDeleteStorage(storage);
    setDeleteModalVisible(true);
  };

  const storageList = storages.map(s => (
    <Item key={s.id} onChange={handleChange} onDelete={handleDelete} storage={s}></Item>
  ));

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="space-x-2 mb-2">
              <Button theme="green" title="添加" onClick={() => setCreateModalVisible(true)}>
                添加
              </Button>
            </div>
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-auto" />
                  <col className="hidden md:table-cell w-auto" />
                  <col className="w-auto" />
                  <col className="w-auto md:w-48" />
                </colgroup>
                <thead className="bg-gray-50 text-left border-b boerder-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                      名称
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3 tracking-wider">
                      桶
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      容量
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">{storageList}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <CreateModal
        visible={createModalVisible}
        setVisible={setCreateModalVisible}
        onCreate={handleCreate}
      ></CreateModal>
      <EditModal
        storage={editStorage}
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        onEdit={handleEditStorage}
      ></EditModal>
      <DeleteModal
        storage={deleteStorage}
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onDelete={handleDeleteStorage}
      ></DeleteModal>
    </>
  );
}

export default layoutAdmin(Storages);
