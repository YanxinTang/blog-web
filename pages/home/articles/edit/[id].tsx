import React, { useState } from 'react';
import Button from 'components/base/Button';
import CodeMirror from 'components/base/CodeMirror';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';
import clientHttp from 'http/client';
import message from 'components/base/message';
import { useRouter } from 'next/router';
import { layoutAdmin } from 'layout';

type CategoriesResponse = Category[];
type ArticleResponse = Article;

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { id } = ctx.query;
  const response = await Promise.all([
    newHttp(ctx).get<CategoriesResponse>('/api/categories'),
    newHttp(ctx).get<ArticleResponse>(`/api/articles/${id}`),
  ]);

  return {
    props: {
      data: { categories: response[0].data, article: response[1].data },
      meta: {
        title: '编辑',
      },
    },
  };
});

interface NewArticleProps {
  data: {
    article: ArticleResponse;
    categories: CategoriesResponse;
  };
}

function NewArticle(props: NewArticleProps) {
  const {
    data: { article, categories },
  } = props;
  const [title, setTitle] = useState(article.title);
  const [categoryID, setCategoryID] = useState(article.categoryID);
  const [content, setContent] = useState(article.content);
  const router = useRouter();

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await clientHttp.put(`/api/admin/articles/${article.id}`, { title, categoryID, content });
      message.success({ message: '发布成功' });
      router.push(`/articles/${article.id}`);
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
    <>
      <nav className="bg-grey-light p-3 rounded w-full">
        <ol className="list-reset flex text-grey-dark">
          <li>
            <a href="#" className="text-blue font-bold">
              编辑
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>{article.title}</li>
        </ol>
      </nav>
      <form className="flex-1 flex flex-col space-y-4" onSubmit={handlePublish}>
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
        <CodeMirror
          className="flex-1 border border-gray-300 rounded"
          value={content}
          onChange={value => setContent(value)}
        ></CodeMirror>
        <div className="space-y-2">
          <Button type="indigo" htmlType="submit" block>
            发布
          </Button>
        </div>
      </form>
    </>
  );
}

export default layoutAdmin(NewArticle);
