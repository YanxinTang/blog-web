import React from 'react';
import ActiveLink from 'components/base/ActiveLink';
import Sidebar from './index';
import type { SidebarProps } from './index';
import styles from './Admin.module.css';

type SidebarAdminProps = Omit<SidebarProps, 'children'>;

export default function SidebarAdmin(props: SidebarAdminProps) {
  return (
    <Sidebar {...props}>
      <nav className="flex flex-col mt-10 px-4 text-center space-y-2">
        <ActiveLink href="/home" activeClassName={styles.active} passHref exact>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            总览
          </a>
        </ActiveLink>
        <ActiveLink href="/home/articles" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            文章管理
          </a>
        </ActiveLink>

        <ActiveLink href="/home/categories" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            分类管理
          </a>
        </ActiveLink>

        <ActiveLink href="/home/storages" activeClassName={styles.active} passHref>
          <a className={styles.menu} onClick={() => props.onToggle?.(false)}>
            存储管理
          </a>
        </ActiveLink>
      </nav>
    </Sidebar>
  );
}
