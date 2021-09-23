import Link from 'next/link';
import React from 'react';
import type { ItemRender } from './index';

interface PagerProps {
  page: number;
  active?: boolean;
  itemRender: ItemRender;
}

const activeClassName =
  'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium';
const plainClassName =
  'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium';

const Pager = (props: PagerProps) => {
  const { active } = props;
  const className = active ? activeClassName : plainClassName;

  return props.itemRender(
    props.page,
    <a aria-current="page" className={className}>
      {props.page}
    </a>
  );
};

export default Pager;
