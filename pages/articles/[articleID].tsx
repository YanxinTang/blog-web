import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { State } from 'store';
import Article from 'components/base/Article';
import Input from 'components/base/Input';
import Button from 'components/base/Button';
import Dropdown, { DropdownOption } from 'components/base/Dropdown';
import { http } from 'http/server';
import clientHttp from 'http/client';
import { layout } from 'layout';
import message from 'components/base/message';
import { errorHandler, shouldWithAuth } from 'utils';
import I from 'components/base/Icon';
import Form, { Field } from 'components/base/Form';
import { InputCaptchaValue } from 'components/base/InputCaptcha';

export const getServerSideProps: GetServerSideProps = shouldWithAuth(async ctx => {
  const { articleID } = ctx.query;

  const articleReq = http.get<Article>(`/api/articles/${articleID}`);
  const commentsReq = http.get(`/api/articles/${articleID}/comments`);
  const [articleRes, commentsRes] = await Promise.all([articleReq, commentsReq]);

  return {
    props: {
      data: {
        article: articleRes.data,
        comments: commentsRes.data.comments,
      },
      meta: {
        title: articleRes.data.title,
      },
    },
  };
});

export interface ArticleProps {
  data: {
    article: Article;
    comments: Comment[];
  };
}

interface CommentProps {
  comment: Comment;
  onDelete: (commentID: number) => void;
}

const Comment = (props: CommentProps) => {
  const { comment, onDelete } = props;

  const options = useMemo<DropdownOption[]>(() => {
    return [
      {
        key: 'signout',
        text: '删除',
        onClick: () => {
          onDelete(comment.id);
        },
      },
    ];
  }, [onDelete, comment.id]);

  return (
    <div className="flex flex-col border border-gray-300 rounded bg-white">
      <div className="flex flex-row justify-between p-2 bg-gray-100">
        <div className="items-baseline">
          <strong>{comment.username}</strong>
          <span className="ml-2 text-xs text-gray-400">{comment.createdAt}</span>
        </div>
        <div className="menu">
          <Dropdown options={options}>
            <Button ghost>
              <I id="three-dots"></I>
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="p-2">{comment.content}</div>
    </div>
  );
};

interface FormValues {
  username: string;
  content: string;
  captcha: InputCaptchaValue;
}

function ArticleLayout(props: ArticleProps) {
  const {
    data: { article },
  } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(props.data.comments);
  const [username, setUsername] = useState('');
  const [form] = Form.useForm<FormValues>();
  const user = useSelector<State, User | null>(state => state.auth.user);
  const initFormValue = {
    username: user?.username ?? '匿名',
  };

  useEffect(() => {
    const username = localStorage.getItem('username') ?? '';
    setUsername(username);
  }, []);

  const handleDelete = async () => {
    try {
      await clientHttp.delete(`/api/admin/articles/${article.id}`);
      message.success('删除成功');
      router.push('/');
    } catch (e) {
      message.error(errorHandler(e));
    }
  };

  const handleFinish = async (values: FormValues) => {
    try {
      const { data } = await clientHttp.post<Comment>(`/api/articles/${article.id}/comments`, {
        username: values.username,
        content: values.content,
        captchaKey: values.captcha.key,
        captchaText: values.captcha.text,
      });
      setComments([...comments, data]);
      form.resetFields();
      localStorage.setItem('username', username);
    } catch (error) {
      message.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentID: number) => {
    try {
      await clientHttp.delete(`/api/admin/articles/${article.id}/comment/${commentID}`);
      message.success('删除成功');
      setComments(comments => comments.filter(comment => comment.id !== commentID));
    } catch (error) {
      message.error(errorHandler(error));
    }
  };

  const commentList = comments.map(c => <Comment key={c.id} comment={c} onDelete={handleDeleteComment} />);

  return (
    <main>
      <div>
        <div className="border-solid border-gray-100">
          <Article {...article}></Article>
        </div>
        {user && (
          <div className="my-4 space-x-2">
            <Link href={`/home/articles/edit/${article.id}`} passHref>
              <Button type="indigo">编辑</Button>
            </Link>
            <Button type="red" ghost onClick={handleDelete}>
              删除
            </Button>
          </div>
        )}
        <div>
          <Form form={form} initialValues={initFormValue} onFinish={handleFinish}>
            <Field name="username" label="昵称" rules={[{ required: true }]}>
              <Input type="text" placeholder="昵称" />
            </Field>
            <Field name="content" label="内容" rules={[{ required: true }]}>
              <Input.Textarea placeholder="写点什么吧..."></Input.Textarea>
            </Field>
            <Field name="captcha" label="验证码">
              <Input.Captcha placeholder="验证码"></Input.Captcha>
            </Field>
            <Button type="indigo" htmlType="submit">
              评论
            </Button>
          </Form>
          <div className="space-y-2 mt-4">{commentList}</div>
        </div>
      </div>
    </main>
  );
}

export default layout(ArticleLayout);
