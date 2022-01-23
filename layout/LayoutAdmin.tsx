import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from 'store';
import { UploadPanelState } from '@reducers/upload';
import SidebarAdmin from '@components/Sidebar/Admin';
import Header from '@components/Header';
import { mergeClassNames } from 'utils';
import UploadPanel from 'src/layout/UploadPanel';

export interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdminLayout(props: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const uploadPanelState = useSelector<State, UploadPanelState>(state => state.upload.state);

  const title = props.title ?? '';

  const handleToggleSidebar = (open = !sidebarOpen) => {
    setSidebarOpen(open);
  };

  return (
    <div className={props.className}>
      <div className="container mx-auto">
        <div className="flex h-screen dark:bg-gray-800 font-roboto">
          <SidebarAdmin open={sidebarOpen} onToggle={handleToggleSidebar}></SidebarAdmin>
          <div className="relative flex-1 h-screen overflow-hidden bg-black">
            <div
              className={mergeClassNames(
                'flex flex-col h-full transition-all bg-gray-100',
                uploadPanelState === UploadPanelState.visible ? 'rounded-t-xl mx-4 mt-4' : ''
              )}
            >
              <Header.Admin title={title} onToggle={handleToggleSidebar}></Header.Admin>
              <main
                className={mergeClassNames(
                  'flex-1 flex flex-col overflow-x-hidden overflow-y-auto container mx-auto px-6 py-8',
                  uploadPanelState === UploadPanelState.collapse ? 'mb-8' : ''
                )}
              >
                {props.children}
              </main>
            </div>
            <UploadPanel></UploadPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
