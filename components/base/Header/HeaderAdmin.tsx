import React, { useCallback, useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { useSelector } from 'react-redux';
import router from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Dropdown, { DropdownOption } from 'components/base/Dropdown';
import clientHttp from 'http/client';
import { State } from 'store';
import { TaskID, UploadTask } from '@reducers/upload/interface';
import { errorHandler, mergeClassNames } from 'utils';
import message from 'components/base/message';
import Progress from 'components/base/Progress';
import Breadcrumb from 'components/base/Breadcrumb';
import avatar from 'assets/images/avatar.png';
import { getArticle, getStorage } from 'api';
import Icon from 'components/base/Icon';

const UploadButton = () => {
  const taskIDs = useSelector<State, TaskID[]>(state => state.upload.taskIDs);
  const taskMap = useSelector<State, Record<TaskID, UploadTask>>(state => state.upload.taskMap);
  const activeTaskIDs = taskIDs.filter(taskID => taskMap[taskID].loaded < taskMap[taskID].size);

  const percent = useMemo(() => {
    let total = 0;
    let loaded = 0;
    for (let taskID of taskIDs) {
      const task = taskMap[taskID];
      loaded += task.loaded;
      total += task.size;
    }
    return Math.floor((loaded / total) * 100) || 0;
  }, [taskIDs, taskMap]);

  let child = (
    <span className="text-sm">
      <Icon id="cloud-arrow-up"></Icon>
    </span>
  );
  if (activeTaskIDs.length > 0) {
    child = (
      <Progress type="circle" percent={percent} size="1em" strokeWidth={16}>
        <span className="text-sm">{activeTaskIDs.length}</span>
      </Progress>
    );
  }
  return (
    // eslint-disable-next-line
    <Link href="/home/upload">
      <button className="flex text-xl text-gray-600">{child}</button>
    </Link>
  );
};

export interface HeaderAdminProps {
  title: string;
  className?: string;
  onToggle?: (open: boolean) => void;
}

export default function HeaderAdmin(props: HeaderAdminProps) {
  const user = useSelector<State, User | null>(state => state.auth.user);

  const options = useMemo<DropdownOption[]>(() => {
    return [
      {
        key: 'index',
        text: '首页',
        onClick: () => {
          router.push('/');
        },
      },
      {
        key: 'signout',
        text: '退出',
        onClick: async () => {
          try {
            await clientHttp.post('/api/signout');
            router.push('/signin');
          } catch (error) {
            message.error({ message: errorHandler(error) });
          }
        },
      },
    ];
  }, []);

  const getDefaultTextGenerator = useCallback((param: string) => {
    return (
      {
        home: '总览',
        drafts: '草稿箱',
        articles: '文章管理',
        categories: '分类管理',
        storages: '存储管理',
        upload: '上传管理',
        edit: '编辑',
        new: '新增',
      }[param] || param
    );
  }, []);

  const getTextGenerator = useCallback((param: string, query: ParsedUrlQuery) => {
    return (
      {
        articleID: async () => (await getArticle(clientHttp)(query[param] as string)).data.title,
        storageID: async () => (await getStorage(clientHttp)(query[param] as string)).data.name,
      }[param] || null
    );
  }, []);

  return (
    <header className={mergeClassNames('flex justify-between items-center p-4', props.className)}>
      <div className="flex items-center space-x-4 lg:space-x-0">
        <button className="text-2xl text-gray-500 focus:outline-none lg:hidden" onClick={() => props.onToggle?.(true)}>
          <Icon id="list" />
        </button>
        <div className="lg:text-2xl font-medium text-gray-800">
          <Breadcrumb
            omitroot
            getDefaultTextGenerator={getDefaultTextGenerator}
            getTextGenerator={getTextGenerator}
          ></Breadcrumb>
          <h1 className="text-2xl font-medium text-gray-800 dark:text-white"></h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <UploadButton></UploadButton>
        {user && (
          <div className="relative">
            <Dropdown options={options}>
              <button className="flex items-center space-x-2 relative focus:outline-none">
                <h2 className="text-gray-700 dark:text-gray-300 text-sm hidden sm:block">{user.username}</h2>
                <div className="relative h-9 w-9 rounded-full border-2 border-purple-500 object-cover overflow-hidden">
                  <Image src={avatar} layout="fill" alt="头像" />
                </div>
              </button>
            </Dropdown>
          </div>
        )}
      </div>
    </header>
  );
}
