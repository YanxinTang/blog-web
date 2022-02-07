import React, { useEffect, useState } from 'react';
import SidebarAdmin from 'components/base/Sidebar/Admin';
import Header from 'components/base/Header';
import { mergeClassNames } from 'utils';
import styles from './styles.module.scss';

export interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdminLayout(props: LayoutProps) {
  const title = props.title ?? '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = (event: Event) => {
      const target = event.target as Document;
      setScrollY(target.documentElement.scrollTop || target.body.scrollTop);
    };
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [setScrollY]);

  const handleToggleSidebar = (open = !sidebarOpen) => {
    setSidebarOpen(open);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-row items-start">
        <SidebarAdmin open={sidebarOpen} onToggle={handleToggleSidebar}></SidebarAdmin>
        <div className="flex-1 flex flex-col relative min-h-screen bg-gray-100">
          <Header.Admin
            title={title}
            className={mergeClassNames(styles.header, scrollY > 0 ? styles['header--shadow'] : '')}
            onToggle={handleToggleSidebar}
          ></Header.Admin>
          <main className="flex-1 flex flex-col px-6 py-8">{props.children}</main>
        </div>
      </div>
    </div>
  );
}
