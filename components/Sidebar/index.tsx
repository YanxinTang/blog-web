import { mergeClassNames } from '@util';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { State } from '@store';
import { useSelector } from 'react-redux';

export interface SidebarProps {
  open: boolean;
  children?: React.ReactNode;
  onToggle?: (open: boolean) => void;
}

export default function Sidebar(props: SidebarProps) {
  const [portal, setPortal] = useState(false);
  const isSsr = typeof window === 'undefined';
  const { open } = props;

  useEffect(() => {
    const handleResize = () => {
      setPortal(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.setAttribute('style', 'overflow: hidden');
    } else {
      document.body.removeAttribute('style');
    }
  }, [open]);

  const content = (
    <div className="w-60 bg-white dark:bg-gray-900 overflow-y-auto md:block">
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center">
          <span className="text-gray-800 dark:text-white text-2xl font-semibold">Dashboard</span>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  );

  const portalContent = (
    <div className="">
      <div
        className={mergeClassNames('mask fixed inset-0 z-40 bg-gray-100 bg-opacity-50', open ? 'block' : 'hidden')}
        onClick={() => props.onToggle?.(false)}
      ></div>
      {React.cloneElement(content, {
        className: mergeClassNames(
          'fixed z-50 inset-y-0 left-0 w-60 bg-white dark:bg-gray-900 overflow-y-auto transform transition-transform',
          open ? '' : '-translate-x-full'
        ),
      })}
    </div>
  );

  return isSsr || !portal ? content : ReactDOM.createPortal(portalContent, window.document.body);
}
