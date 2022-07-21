import Pagination, { ItemRender } from 'components/base/Pagination';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

export interface NextPaginationProps {
  pagination: Pagination;
}

export default function NextPagination(props: NextPaginationProps) {
  const { pathname, query } = useRouter();

  const paginationItemRender = useCallback<ItemRender>(
    (page, element) => {
      return (
        <Link
          href={{
            pathname,
            query: { ...query, page },
          }}
          passHref
          scroll={false}
        >
          {element}
        </Link>
      );
    },
    [pathname, query]
  );

  return <Pagination pagination={props.pagination} itemRender={paginationItemRender}></Pagination>;
}
