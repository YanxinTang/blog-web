import React from 'react';
import ActiveLink from '@components/ActiveLink';
import Sidebar from './index';
import type { SidebarProps } from './index';
import styles from './Admin.module.css';

type SidebarAdminProps = Omit<SidebarProps, 'children'>;

export default function SidebarAdmin(props: SidebarAdminProps) {
  return (
    <Sidebar {...props}>
      <nav className="flex flex-col mt-10 px-4 text-center space-y-2">
        <ActiveLink href="/home" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            总览
          </a>
        </ActiveLink>
        <ActiveLink href="/home/articles/new" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            新增文章
          </a>
        </ActiveLink>

        <ActiveLink href="/home/categories" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            分类管理
          </a>
        </ActiveLink>
        <ActiveLink href="/home/drafts" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            草稿箱
          </a>
        </ActiveLink>
      </nav>
    </Sidebar>
  );
}
