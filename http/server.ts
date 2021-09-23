import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

const serverConfig = {
  baseURL: process.env.SERVER_BASE_URL,
}

export const http = axios.create(serverConfig);

export function newHttp(ctx: GetServerSidePropsContext) {
  const instance = axios.create({
    ...serverConfig,
    headers: {
      Cookie: ctx.req.headers?.cookie ?? ''
    }
  });
  return instance;
}