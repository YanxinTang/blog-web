import React from 'react';
import Header from 'components/base/Header';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function BaseLayout(props: LayoutProps) {
  return (
    <div className={props.className}>
      <Header />
      <div className="container mx-auto px-4 py-8">{props.children}</div>
    </div>
  );
}
