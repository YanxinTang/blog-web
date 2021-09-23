import React from 'react';
import ActiveLink from '@components/ActiveLink';
import Sidebar from './index';
import type { SidebarProps } from './index';

type SidebarAdminProps = Omit<SidebarProps, 'children'>;

export default function SidebarAdmin(props: SidebarAdminProps) {
  return (
    <Sidebar {...props}>
      <ActiveLink href="/home" passHref>
        <a
          className="py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
          onClick={() => props.onToggle?.(false)}
        >
          总览
        </a>
      </ActiveLink>
      <ActiveLink href="/home/articles/new" passHref>
        <a
          className="mt-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
          onClick={() => props.onToggle?.(false)}
        >
          新增文章
        </a>
      </ActiveLink>

      <ActiveLink href="/home/categories" passHref>
        <a
          className="mt-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
          onClick={() => props.onToggle?.(false)}
        >
          分类管理
        </a>
      </ActiveLink>
      <ActiveLink href="/home/drafts" passHref>
        <a
          className="mt-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
          onClick={() => props.onToggle?.(false)}
        >
          草稿箱
        </a>
      </ActiveLink>
    </Sidebar>
  );
}
