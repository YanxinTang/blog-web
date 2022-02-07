import React from 'react';
import Pager from './Pager';
import I from 'components/base/Icon';

export type ItemRender = (page: number, element: React.ReactElement) => React.ReactElement;

const defaultItemRender: ItemRender = (page, element) => element;

interface PaginationProps {
  pagination: Pagination;
  itemRender?: ItemRender;
}

const prevElement = (
  <a className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
    <span className="sr-only">Previous</span>
    <I id="chevron-left"></I>
  </a>
);

const nextElement = (
  <a
    href="#"
    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
  >
    <span className="sr-only">Next</span>
    <I id="chevron-right"></I>
  </a>
);

export default function Pagination(props: PaginationProps) {
  const { pagination, itemRender = defaultItemRender } = props;

  if (pagination.total <= 0 || pagination.perpage <= 0) {
    return null;
  }

  const allPages = Math.ceil(pagination.total / pagination.perpage);
  const pagerList = [];

  if (allPages <= 6) {
    for (let i = 1; i <= allPages; i++) {
      pagerList.push(<Pager page={i} key={i} active={pagination.page === i} itemRender={itemRender}></Pager>);
    }
  } else {
    pagerList.push(<Pager page={1} key={1} active={pagination.page === 1} itemRender={itemRender}></Pager>);
    if (pagination.page >= 5) {
      pagerList.push(
        <span
          key="left-items-ellipsis"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          ...
        </span>
      );
    }

    let start, end;
    if (pagination.page < 5) {
      start = 2;
      end = 1 + 5;
    } else if (pagination.page >= allPages - 2) {
      start = allPages - 5;
      end = allPages - 1;
    } else {
      start = pagination.page - 2;
      end = pagination.page + 2;
    }

    for (let i = start; i <= end; i++) {
      pagerList.push(<Pager page={i} key={i} active={pagination.page === i} itemRender={itemRender}></Pager>);
    }
    if (allPages - pagination.page >= 5 - 1) {
      pagerList.push(
        <span
          key="right-items-ellipsis"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          ...
        </span>
      );
    }
    pagerList.push(
      <Pager page={allPages} key={allPages} active={pagination.page === allPages} itemRender={itemRender}></Pager>
    );
  }

  const prevPage = pagination.page <= 1 ? prevElement : itemRender(pagination.page - 1, prevElement);
  const nextPage = pagination.page >= allPages ? nextElement : itemRender(pagination.page + 1, nextElement);

  return (
    <div className="py-3">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {prevPage}
        {pagerList}
        {nextPage}
      </nav>
    </div>
  );
}
