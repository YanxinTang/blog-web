import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { State } from '@store';
import Article from '@components/Article';
import Input from '@components/Input';
import Button from '@components/Button';
import Dropdown, { DropdownOption } from '@components/Dropdown';
import { http } from '@http/server';
import clientHttp from '@http/client';
import { layout } from 'layout';
import message from '@components/message';
import { errorHandler, shouldWithAuth } from 'utils';
import More from 'assets/icons/more.svg';

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
              <More></More>
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="p-2">{comment.content}</div>
    </div>
  );
};

function ArticleLayout(props: ArticleProps) {
  const {
    data: { article },
  } = props;
  const router = useRouter();
  const [comments, setComments] = useState(props.data.comments);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const user = useSelector<State, User | null>(state => state.auth.user);

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

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await clientHttp.post<Comment>(`/api/articles/${article.id}/comments`, {
        username,
        content,
      });
      setComments([...comments, data]);
      setContent('');
      localStorage.setItem('username', username);
    } catch (error) {
      message.error(errorHandler(error));
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
          <form className="space-y-4" onSubmit={handleComment} ref={form}>
            <div>
              <Input
                type="text"
                placeholder="昵称"
                required
                value={username}
                onChange={event => setUsername(event.target.value)}
              />
            </div>
            <div>
              <Input.Textarea
                placeholder="写点什么吧..."
                required
                value={content}
                onChange={event => setContent(event.target.value)}
              ></Input.Textarea>
            </div>
            <div>
              <Button type="indigo" htmlType="submit">
                评论
              </Button>
            </div>
          </form>
          <div className="space-y-2 mt-4">{commentList}</div>
        </div>
      </div>
    </main>
  );
}

export default layout(ArticleLayout);
