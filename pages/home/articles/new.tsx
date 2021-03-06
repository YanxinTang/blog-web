import React, { useRef, useState } from 'react';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { http } from 'http/server';
import clientHttp from 'http/client';
import message from 'components/base/message';
import { layoutAdmin } from 'layout';
import Form from 'components/base/Form';
import Input from 'components/base/Input';
import Button from 'components/base/Button';
import CodeMirror from 'components/base/CodeMirror';
import { createArticle, draftArticle, publishArticle, updateArticle } from 'api';
import { useRouter } from 'next/router';
import client from 'http/client';

type CategoriesResponse = Category[];

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { data } = await http.get<CategoriesResponse>('/api/categories');
  return {
    props: {
      data: {
        categories: data,
      },
      meta: {
        title: '新增文章',
      },
    },
  };
});

interface NewArticleProps {
  data: {
    categories: CategoriesResponse;
  };
}

interface FormValues {
  title: string;
  categoryID: BaseModel['id'];
  content: string;
}

function NewArticle(props: NewArticleProps) {
  const { data } = props;

  const [form] = Form.useForm<FormValues>();
  const operation = useRef('publish');

  const [articleID, setArticleID] = useState<number>(0);
  const router = useRouter();

  const initFormValues: FormValues = {
    title: '',
    categoryID: data.categories.length ? data.categories[0].id : -1,
    content: '',
  };

  const handleFinish = async (values: FormValues) => {
    values.categoryID = parseInt(values.categoryID + '');
    try {
      if (operation.current === 'publish') {
        if (articleID === 0) {
          await publishArticle(clientHttp)(values);
        } else {
          await updateArticle(clientHttp)(articleID, { ...values, status: 1 });
        }
        message.success({ message: '发布成功' });
        router.push('/home/articles');
      } else {
        if (articleID === 0) {
          const { data } = await draftArticle(clientHttp)(values);
          setArticleID(data.id);
        } else {
          await updateArticle(clientHttp)(articleID, { ...values, status: 1 });
        }
        message.success({ message: '保存成功' });
      }
    } catch (error) {
      message.error(errorHandler(error));
    }
  };

  const handlePublish = () => {
    operation.current = 'publish';
    form.submit();
  };

  const handleDraft = () => {
    operation.current = 'draft';
    form.submit();
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
        <Button type="button" theme="indigo" onClick={handlePublish}>
          发布
        </Button>
        <Button type="button" theme="green" ghost onClick={handleDraft}>
          存草稿
        </Button>
      </div>
    </Form>
  );
}

export default layoutAdmin(NewArticle);
