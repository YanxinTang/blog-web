import React, { useState } from 'react';
import Button from 'components/base/Button';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';
import clientHttp from 'http/client';
import message from 'components/base/message';
import { useRouter } from 'next/router';
import { layoutAdmin } from 'layout';

type CategoriesResponse = Category[];
type DraftResponse = Article;

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { id } = ctx.query;
  const response = await Promise.all([
    newHttp(ctx).get<CategoriesResponse>('/api/categories'),
    newHttp(ctx).get<DraftResponse>(`/api/admin/drafts/${id}`),
  ]);

  return {
    props: {
      data: { categories: response[0].data, draft: response[1].data },
      meta: {
        title: '修改草稿',
      },
    },
  };
});

interface NewArticleProps {
  data: {
    draft: DraftResponse;
    categories: CategoriesResponse;
  };
}

function NewArticle(props: NewArticleProps) {
  const {
    data: { draft, categories },
  } = props;
  const [title, setTitle] = useState(draft.title);
  const [categoryID, setCategoryID] = useState(draft.categoryID);
  const [content, setContent] = useState(draft.content);
  const router = useRouter();

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await clientHttp.post(`/api/admin/drafts/${draft.id}`);
      message.success({ message: '发布成功' });
      router.push('/home/drafts');
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const handleSaveDraft = async () => {
    try {
      await clientHttp.put<Article>(`/api/admin/drafts/${draft.id}`, { title, categoryID, content });
      message.success({ message: '保存成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const options = categories.map(c => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ));

  return (
    <div>
      <nav className="bg-grey-light p-3 rounded w-full">
        <ol className="list-reset flex text-grey-dark">
          <li>
            <a href="#" className="text-blue font-bold">
              草稿箱
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="#" className="text-blue font-bold">
              编辑
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>{draft.title}</li>
        </ol>
      </nav>
      <form className="space-y-4" onSubmit={handlePublish}>
        <div>
          <input
            type="text"
            required
            placeholder="标题"
            autoFocus
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <select
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={categoryID}
            onChange={event => setCategoryID(parseInt(event.target.value))}
          >
            {options}
          </select>
        </div>
        <div>
          <textarea
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            rows={10}
            placeholder="写点什么吧..."
            value={content}
            onChange={event => setContent(event.target.value)}
          ></textarea>
        </div>
        <div className="space-y-2">
          <Button type="indigo" htmlType="submit" block>
            发布
          </Button>
          <Button type="yellow" htmlType="button" block ghost onClick={handleSaveDraft}>
            存草稿
          </Button>
        </div>
      </form>
    </div>
  );
}

export default layoutAdmin(NewArticle);
