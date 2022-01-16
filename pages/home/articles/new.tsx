import React, { useState } from 'react';
import Button from '@components/Button';
import CodeMirror from '@components/CodeMirror';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { http } from '@http/server';
import clientHttp from '@http/client';
import message from '@components/message';
import { layoutAdmin } from 'layout';

type CategoriesResponse = Category[];

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { data } = await http.get<CategoriesResponse>('/api/categories');
  return {
    props: {
      data,
      meta: {
        title: '新增文章',
      },
    },
  };
});

interface NewArticleProps {
  data: CategoriesResponse;
}

function NewArticle(props: NewArticleProps) {
  const { data } = props;
  const [draftID, setDraftID] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [categoryID, setCategoryID] = useState(data.length ? data[0].id : undefined);
  const [content, setContent] = useState('');

  const handleCreateArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await clientHttp.post('/api/admin/articles', { title, categoryID, content });
      message.success({ message: '发布成功' });
      setTitle('');
      setContent('');
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const handleDraft = async () => {
    try {
      if (draftID <= 0) {
        const { data: draft } = await clientHttp.post<Article>('/api/admin/drafts', { title, categoryID, content });
        setDraftID(draft.id);
      } else {
        await clientHttp.put<Article>(`/api/admin/drafts/${draftID}`, { title, categoryID, content });
      }
      message.success({ message: '保存成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const options = data.map(c => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ));

  return (
    <form className="flex-1 flex flex-col space-y-4" onSubmit={handleCreateArticle}>
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
      <div>
        <Button type="indigo" htmlType="submit" className="w-3/4" block>
          发布
        </Button>
        <Button type="yellow" htmlType="button" className="mt-2" ghost block onClick={handleDraft}>
          存草稿
        </Button>
      </div>
    </form>
  );
}

export default layoutAdmin(NewArticle);
