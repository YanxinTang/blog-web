import React, { useState } from 'react';
import { layoutAdmin } from 'layout';
import { formatBytes, withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';
import Button from 'components/base/Button';
import DeleteFile from 'components/page/home/storage/DeleteFile';
import UploadButton from 'components/base/UploadButton';
import { useDispatch } from 'react-redux';
import { uploadFile } from '@reducers/upload';
import message from 'components/base/message';
import { getStorageObjects, GetStorageObjectsResponse } from 'api';
import Icon from 'components/base/Icon';

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { storageID: id } = ctx.query;
  if (typeof id === 'string') {
    const storageID = parseInt(id);
    if (!Number.isNaN(storageID)) {
      const { data } = await getStorageObjects(newHttp(ctx))(id);
      return {
        props: {
          data: {
            getStorageObjectsResponse: data,
            storageID,
          },
          meta: {
            title: '存储管理',
          },
        },
      };
    }
  }
  return {
    notFound: true,
  };
});

interface ItemProps {
  file: FileObject;
  onCopy: (file: FileObject) => void;
  onDelete: (file: FileObject) => void;
}

const Item = (props: ItemProps) => {
  const { file } = props;

  return (
    <tr>
      <td className="px-6 py-4 text-overflow-ellipsis" title={file.Key}>
        {file.Key}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{formatBytes(file.Size)}</td>
      <td className="px-6 py-4 space-y-2 md:space-x-2">
        <Button theme="indigo" ghost title="复制链接" onClick={() => props.onCopy(file)}>
          <Icon id="clipboard" />
        </Button>
        <Button theme="red" ghost title="删除" onClick={() => props.onDelete(file)}>
          <Icon id="trash"></Icon>
        </Button>
      </td>
    </tr>
  );
};

interface StorageListProps {
  data: {
    storageID: number;
    getStorageObjectsResponse: GetStorageObjectsResponse;
  };
}

const StorageList = (props: StorageListProps) => {
  const {
    data: { storageID, getStorageObjectsResponse },
  } = props;
  const dispatch = useDispatch();
  const [files, setFiles] = useState<FileObject[]>(getStorageObjectsResponse.Contents);
  const [deleteFileModalVisible, setDeleteFileModalVisible] = useState(false);
  const [deleteFile, setDeleteFile] = useState<FileObject | null>(null);

  const handleFiles = (files: File[]) => {
    for (let file of files) {
      dispatch(uploadFile(storageID, file));
    }
  };

  const handleDelete = (file: FileObject) => {
    setDeleteFile(file);
    setDeleteFileModalVisible(true);
  };

  const handleCopyFileLink = async (file: FileObject) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/api/storages/${storageID}/${file.Key}`);
      message.success('复制成功');
    } catch {
      message.error('复制失败');
    }
  };

  const handleDeleteFile = (file: FileObject) => {
    setFiles(files => files.filter(item => item.Key !== file.Key));
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="space-x-2 mb-2">
              <UploadButton onFiles={handleFiles}>上传</UploadButton>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th scope="col" className="w-auto px-6 py-4 uppercase tracking-wider">
                      名称
                    </th>
                    <th scope="col" className="w-auto md:w-32 px-6 py-4 tracking-wider">
                      大小
                    </th>
                    <th scope="col" className="w-auto md:w-48 px-6 py-4 tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map(file => (
                    <Item
                      key={file.ETag}
                      file={file}
                      onCopy={handleCopyFileLink}
                      onDelete={() => handleDelete(file)}
                    ></Item>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteFile
        visibleState={[deleteFileModalVisible, setDeleteFileModalVisible]}
        storageID={storageID}
        file={deleteFile}
        onDelete={handleDeleteFile}
      ></DeleteFile>
    </>
  );
};

export default layoutAdmin(StorageList);
