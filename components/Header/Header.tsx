import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Dropdown, { DropdownOption } from '@components/Dropdown';
import router from 'next/router';
import { errorHandler } from '@util';
import message from '@components/message';
import { useSelector } from 'react-redux';
import { State } from '@store';
import clientHttp from '@http/client';
import avatar from 'assets/images/avatar.png';
import styles from './Header.module.css';

export default function Header() {
  const user = useSelector<State, User | null>(state => state.auth.user);

  const options = useMemo<DropdownOption[]>(() => {
    return [
      {
        key: 'dashboard',
        text: '控制台',
        onClick: () => {
          router.push('/home');
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
    <div className={styles.header}>
      <nav className="container mx-auto flex flex-row flex-nowrap justify-between items-center xl:max-w-5xl">
        <Link href="/">
          <a className={styles.brand}>
            <img src="/logo.png" alt="logo" />
          </a>
        </Link>
        {user && (
          <div className="flex content-center">
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
      </nav>
    </div>
  );
}
