import React, { useState } from 'react';
import Button from 'components/base/Button';
import CodeMirror from 'components/base/CodeMirror';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';
import clientHttp from 'http/client';
import message from 'components/base/message';
import { useRouter } from 'next/router';
import { layoutAdmin } from 'layout';
import Form from 'components/base/Form';
import Input from 'components/base/Input';
import { getArticle, updateArticle } from 'api';

type CategoriesResponse = Category[];

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { articleID } = ctx.query;
  const response = await Promise.all([
    newHttp(ctx).get<CategoriesResponse>('/api/categories'),
    getArticle(newHttp(ctx))(articleID as string),
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

interface EditArticleProps {
  data: {
    article: Article;
    categories: CategoriesResponse;
  };
}

interface FormValues {
  title: string;
  categoryID: BaseModel['id'];
  content: string;
}

function EditArticle(props: EditArticleProps) {
  const { data } = props;

  const [form] = Form.useForm<FormValues>();
  const router = useRouter();

  const initFormValues: FormValues = {
    title: data.article.title,
    categoryID: data.article.edges.category!.id,
    content: data.article.content,
  };

  const handleFinish = async (values: FormValues) => {
    values.categoryID = parseInt(values.categoryID + '');
    try {
      await updateArticle(clientHttp)(data.article.id, values);
      router.push('/home/articles');
    } catch (error) {
      message.error(errorHandler(error));
    }
  };

  const options = data.categories.map(c => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ));

  return (
    <Form form={form} initialValues={initFormValues} onFinish={handleFinish}>
      <Form.Field name="title" label="标题" rules={[{ required: true }]}>
        <Input placeholder="标题"></Input>
      </Form.Field>
      <Form.Field name="categoryID" label="分类" rules={[{ required: true }]}>
        <select className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
          {options}
        </select>
      </Form.Field>
      <Form.Field name="content" label="内容">
        <CodeMirror className="flex-1 border border-gray-300 rounded"></CodeMirror>
      </Form.Field>
      <div className="space-x-2">
        <Button theme="indigo" type="submit">
          保存
        </Button>
      </div>
    </Form>
  );
}

export default layoutAdmin(EditArticle);
