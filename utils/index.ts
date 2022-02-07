import { AxiosError } from 'axios';
import { HTMLAttributes } from 'react';
export * from './authGuard';

type ClassName = HTMLAttributes<HTMLElement>['className'];
export function mergeClassNames(...classNames: ClassName[]): ClassName {
  return classNames.reduce((all, current) => {
    if (all) {
      return current ? `${all} ${current}` : all;
    }
    return current;
  }, '');
}

export function isApiError(x: unknown): x is AxiosError<ResponseError> {
  return typeof x === 'object';
}

export function errorHandler(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message ?? '请求失败，请稍候重试';
  }
  return '请求失败，请稍候重试';
}

export function pageTitle(...args: (string | undefined)[]): string {
  return args.reduce<string>((title, arg) => {
    if (title) {
      return arg ? `${arg} - ${title}` : title;
    }
    return arg ?? title;
  }, '');
}

export const isArray = Array.isArray;

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(1024, i)).toFixed(dm)} ${sizes[i]}`;
}

export function omit<T extends object, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
  const clone = { ...obj };

  if (Array.isArray(fields)) {
    fields.forEach(key => {
      delete clone[key];
    });
  }

  return clone;
}

export function isServerSide(): boolean {
  return typeof window === 'undefined';
}
