import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import http from '@http/client';
import { newHttp } from '@http/server';
import { errorHandler } from '@util';
import { layout } from 'layout';
import message from '@components/message';
import Input from '@components/Input';
import Button from '@components/Button';

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    await newHttp(ctx).get('/api/login/session');
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  } catch (error) {
    const { data } = await newHttp(ctx).get('/api/setting', { params: { key: 'signupEnable' } });
    const signupEnable: string = data.value;
    if (signupEnable === '1') {
      return {
        props: {
          meta: {
            title: '注册',
          },
        },
      };
    }
    return {
      notFound: true,
    };
  }
};

function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await http.post<null>('/api/signup', { username, email, password });
      message.success({ message: '注册成功' });
      router.push('/signin');
    } catch (error) {
      message.error(errorHandler(error));
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">注册</h2>
        </div>
        <form className="mt-8 space-y-6" method="post" action="/api/login" onSubmit={handleLogin}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-2">
            <div>
              <label htmlFor="username" className="sr-only">
                用户名
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="用户名"
                value={username}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                邮箱
              </label>
              <Input
                id="email-address"
                name="username"
                type="email"
                placeholder="邮箱"
                value={email}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="密码"
                value={password}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
              />
            </div>
          </div>
          <div>
            <Button type="indigo" htmlType="submit" block>
              注册
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default layout(Signup);
