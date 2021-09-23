import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import router from 'next/router';
import Image from 'next/image';
import Dropdown, { DropdownOption } from '@components/Dropdown';
import clientHttp from '@http/client';
import message from '@components/message';
import { errorHandler } from '@util';
import { State } from '@store';
import FilterLeft from 'assets/icons/filter-left.svg';
import DarkMode from 'assets/icons/dark-mode.svg';
import avatar from 'assets/images/avatar.png';

export interface HeaderAdminProps {
  title: string;
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

  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex items-center space-x-4 lg:space-x-0">
        <button
          className="text-2xl text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden"
          onClick={() => props.onToggle?.(true)}
        >
          <FilterLeft />
        </button>
        <div>
          <h1 className="text-2xl font-medium text-gray-800 dark:text-white">{props.title}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex text-2xl text-gray-600 dark:text-gray-300 focus:outline-none" aria-label="Color Mode">
          <DarkMode />
        </button>
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
