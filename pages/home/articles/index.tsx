import React, { useCallback, useState } from 'react';
import { newHttp } from 'http/server';
import { mergeClassNames, withAuthServerSideProps } from 'utils';
import Button from 'components/base/Button';
import Link from 'next/link';
import message from 'components/base/message';
import { errorHandler } from 'utils';
import clientHttp from 'http/client';
import { layoutAdmin } from 'layout';
import { deleteArticle, getArticles, GetArticlesResponse } from 'api';
import { useRouter } from 'next/router';
import NextPagination from 'components/next/Pagination';
import { useReloadServerSideData } from 'hooks';
import PopConfirm from 'components/base/PopConfirm';
import Icon from 'components/base/Icon';

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { page = 1 } = ctx.query;
  const { data } = await getArticles(newHttp(ctx))({ categoryID: 0, status: 0, page: page as string });
  return {
    props: {
      data,
      meta: {
        title: '文章管理',
      },
    },
  };
});

interface ItemProps extends Article {}

const Item = (props: ItemProps) => {
  const [loading, setLoading] = useState(false);
  const reloadServerSideData = useReloadServerSideData();

  const { id } = props;
  const handleDelete = useCallback(async () => {
    try {
      await deleteArticle(clientHttp)(id);
      reloadServerSideData();
      message.success({ message: '删除成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    } finally {
      setLoading(false);
    }
  }, [id, reloadServerSideData, setLoading]);

  return (
    <tr key={props.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link href={`/home/articles/${props.id}`}>{props.title}</Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{props.edges!.category!.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={mergeClassNames(
            'px-2 py-1 text-white rounded',
            props.status === 1 ? 'bg-green-600' : 'bg-gray-600'
          )}
        >
          {props.status === 1 ? '发布' : '草稿'}
        </span>
      </td>
      <td className="px-6 py-4 space-x-2">
        <PopConfirm title={`确定要删除${props.title}吗？`} onConfirm={handleDelete}>
          <Button theme="red" ghost title="删除" loading={loading}>
            <Icon id="trash"></Icon>
          </Button>
        </PopConfirm>
      </td>
    </tr>
  );
};

interface ArticlesProps {
  data: GetArticlesResponse;
}

function Articles(props: ArticlesProps) {
  const { data } = props;
  const router = useRouter();

  const items = data.articles.map(a => <Item key={a.id} {...a}></Item>);

  return (
    <div className="flex flex-col">
      <div className="space-x-2 mb-2">
        <Button theme="green" title="添加" onClick={() => router.push('/home/articles/new')}>
          添加
        </Button>
      </div>
      <div className="overflow-hidden rounded border border-gray-200 sm:rounded-lg">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto lg:w-32" />
          </colgroup>
          <thead className="bg-gray-50 text-left border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                分类
              </th>
              <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">{items}</tbody>
        </table>
      </div>
      <NextPagination pagination={data.pagination}></NextPagination>
    </div>
  );
}

export default layoutAdmin(Articles);
