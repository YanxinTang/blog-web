import React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Article.module.css';
import { mergeClassNames } from 'utils';

export interface ArticleProps extends Article {}

export default function Article(props: ArticleProps) {
  return (
    <article className={styles.article}>
      <div className={styles.articleHeader}>
        <h1 className={styles.articleHeaderTitle}>
          <Link href={`/articles/${props.id}`} passHref>
            <a className="hover:text-gray-700">{props.title}</a>
          </Link>
        </h1>
        <div className={styles.articleHeaderMeta}>
          <div className={styles.articleHeaderCategory}>
            <i className="iconfont icon-tag"></i>
            <span className="text-white bg-green-400 rounded px-2">{props.category.name}</span>
          </div>
          <div className={styles.articleHeaderDate}>
            <i className="iconfont icon-time"></i>
            {props.createdAt}
          </div>
        </div>
      </div>
      <div className={mergeClassNames(styles.articleBody, 'markdown')}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.content}</ReactMarkdown>
      </div>
    </article>
  );
}
