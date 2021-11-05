import React, { useState, useEffect } from 'react';
import SidebarAdmin from '@components/Sidebar/Admin';
import Header from '@components/Header';

export interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdminLayout(props: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = props.title ?? '';

  const handleToggleSidebar = (open = !sidebarOpen) => {
    setSidebarOpen(open);
  };

  return (
    <div className={props.className}>
      <div className="container mx-auto">
        <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-roboto">
          <SidebarAdmin open={sidebarOpen} onToggle={handleToggleSidebar}></SidebarAdmin>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header.Admin title={title} onToggle={handleToggleSidebar}></Header.Admin>
            <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto container mx-auto px-6 py-8">
              {props.children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
