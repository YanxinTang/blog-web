import { GetServerSideProps } from 'next';
import Pagination, { ItemRender } from '@components/Pagination';
import Article, { ArticleProps } from 'components/Article';
import { http } from '@http/server';
import Link from 'next/link';
import { layout } from 'layout';
import { shouldWithAuth } from '@util';
import Image from 'next/image';
import empty from 'assets/images/empty.png';

interface ArticlesResponse {
  articles: ArticleProps[];
  pagination: Pagination;
}

export const getServerSideProps: GetServerSideProps = shouldWithAuth(async ({ query }) => {
  let articles: ArticlesResponse = {
    articles: [],
    pagination: {
      total: 0,
      page: 0,
      perpage: 0,
    },
  };
  try {
    const { data } = await http.get<ArticlesResponse>('/api/articles', { params: { ...query } });
    articles = data;
  } catch {
    // do nothing
  }
  return { props: { data: articles } };
});

const paginationItemRender: ItemRender = (page, element) => {
  const href = page > 1 ? `/?page=${page}` : '/';
  return (
    <Link href={href} passHref>
      {element}
    </Link>
  );
};

interface IndexProps {
  data: ArticlesResponse;
}

function Index(props: IndexProps) {
  const { data } = props;

  if (data.articles.length === 0) {
    return (
      <>
        <Image src={empty} alt="空空如也"></Image>
      </>
    );
  }

  return (
    <>
      {data.articles.map(article => (
        <Article key={article.id} {...article}></Article>
      ))}
      <Pagination pagination={data.pagination} itemRender={paginationItemRender}></Pagination>
    </>
  );
}

export default layout(Index);
