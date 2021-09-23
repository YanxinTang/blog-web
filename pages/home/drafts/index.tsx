import React, { useState } from 'react';
import { newHttp } from '@http/server';
import { withAuthServerSideProps } from '@util';
import Button from '@components/Button';
import Link from 'next/link';
import message from '@components/message';
import { errorHandler } from '@util';
import clientHttp from '@http/client';
import { layoutAdmin } from 'layout';

interface DraftResponse {
  drafts: Article[];
  page: number;
  perPage: number;
  total: number;
}

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { data } = await newHttp(ctx).get<DraftResponse>('/api/admin/drafts');
  return {
    props: {
      data,
      meta: {
        title: '草稿箱',
      },
    },
  };
});

interface ItemProps extends Article {
  onDelete: (id: BaseModel['id']) => void;
}

const Item = (props: ItemProps) => {
  return (
    <tr key={props.id}>
      <td className="px-6 py-4 whitespace-nowrap">{props.title}</td>
      <td className="px-6 py-4 whitespace-nowrap">{props.category.name}</td>
      <td className="px-6 py-4 flex flex-row flex-nowrap justify-between">
        <Link href={`/home/drafts/edit/${props.id}`}>
          <Button>编辑</Button>
        </Link>
        <Button onClick={() => props.onDelete(props.id)}>删除</Button>
      </td>
    </tr>
  );
};

interface DraftProps {
  data: DraftResponse;
}

function Draft(props: DraftProps) {
  const { data } = props;
  const [drafts, setDrafts] = useState<Article[]>(data.drafts);

  const handleDelete = async (id: BaseModel['id']) => {
    try {
      await clientHttp.delete(`/api/admin/drafts/${id}`);
      setDrafts(drafts => drafts.filter(draft => draft.id !== id));
      message.success({ message: '删除成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const items = drafts.map(c => <Item key={c.id} {...c} onDelete={handleDelete}></Item>);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <colgroup>
                <col className="w-auto" />
                <col className="w-auto" />
                <col className="w-48" />
              </colgroup>
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                    标题
                  </th>
                  <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                    分类名称
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{items}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default layoutAdmin(Draft);
