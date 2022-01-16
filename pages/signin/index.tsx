import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import http from '@http/client';
import { newHttp } from '@http/server';
import { layout } from 'layout';
import { errorHandler } from 'utils';
import Input from '@components/Input';
import Checkbox from '@components/Checkbox';
import Button from '@components/Button';
import message from '@components/message';

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    const response = await newHttp(ctx).get('/api/login/session');
    return {
      redirect: {
        destination: '/home',
        permanent: true,
      },
    };
  } catch (error) {
    return {
      props: {
        initialReduxState: {
          auth: {
            user: null,
          },
        },
        meta: {
          title: '登录',
        },
      },
    };
  }
};

function Signin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await http.post<null>('/api/signin', { username, password, remember });
      message.success({ message: '登录成功' });
      router.push('/home');
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Hi，欢迎回来</h2>
        </div>
        <form className="mt-8 space-y-6" method="post" action="/api/login" onSubmit={handleSignin}>
          <div className="rounded-md shadow-sm space-y-2">
            <div>
              <label htmlFor="username" className="sr-only">
                用户名
              </label>
              <Input
                className="rounded-b-none"
                id="username"
                name="username"
                type="text"
                placeholder="用户名"
                value={username}
                autoFocus
                required
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
              ></Input>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="密码"
                autoComplete="current-password"
                value={password}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                required
              ></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember" name="remember" onChange={event => setRemember(event.target.checked)} />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900 select-none cursor-pointer">
                保持登录
              </label>
            </div>
          </div>
          <div>
            <Button type="indigo" htmlType="submit" block>
              登录
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default layout(Signin);
