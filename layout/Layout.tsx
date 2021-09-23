import React from 'react';
import Header from '@components/Header';

export interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export default function BaseLayout(props: LayoutProps) {
  return (
    <div className={props.className}>
      <Header />
      <div className="container mx-auto px-6 py-8 xl:max-w-5xl">
        {props.children}
      </div>
    </div>
  )
}