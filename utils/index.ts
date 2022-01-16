import { AxiosError } from 'axios';
import { HTMLAttributes } from 'react';
export * from './authGuard';

type ClassName = HTMLAttributes<HTMLElement>['className'];
export function mergeClassNames(...classNames: ClassName[]) : ClassName {
  return classNames.reduce((all, current) => {
    if (all) {
      return current ? `${all} ${current}` : all;
    }
    return current;
  }, '');
}

export function isApiError(x: unknown): x is AxiosError<ResponseError> {
  return typeof x === 'object'
}

export function errorHandler(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message ?? '请求失败，请稍候重试';
  }
  return '请求失败，请稍候重试';
}


export function pageTitle(...args: (string|undefined)[]): string {
  return args.reduce<string>((title, arg) => {
    if (title) {
      return arg ? `${arg} - ${title}` : title
    }
    return arg ?? title;
  }, '');
}

export const isArray = Array.isArray;
