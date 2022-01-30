import { GetServerSideProps } from 'next';
import Pagination, { ItemRender } from '@components/Pagination';
import Article from '@components/Article';
import CategoryList from '@components/CategoryList';
import { http } from '@http/server';
import Link from 'next/link';
import { layout } from 'layout';
import { shouldWithAuth } from 'utils';
import Image from 'next/image';
import empty from 'assets/images/empty.png';

interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

type CategoriesResponse = Category[];

type ServerSideData = ArticlesResponse & { categories: Category[] };

export const getServerSideProps: GetServerSideProps = shouldWithAuth(async ({ query }) => {
  const data: ServerSideData = {
    categories: [],
    articles: [],
    pagination: {
      total: 0,
      page: 0,
      perpage: 0,
    },
  };
  try {
    const categoriesRequest = http.get<CategoriesResponse>('/api/categories');
    const articlesRequest = http.get<ArticlesResponse>('/api/articles', { params: { ...query } });
    const [categoriesResponse, articlesResponse] = await Promise.all([categoriesRequest, articlesRequest]);
    data.categories = categoriesResponse.data;
    data.articles = articlesResponse.data.articles;
    data.pagination = articlesResponse.data.pagination;
  } catch {
    // do nothing
  }
  return { props: { data } };
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
  data: ServerSideData;
}

function Index(props: IndexProps) {
  const { data } = props;

  return (
    <>
      <main className="flex flex-wrap flex-col items-stretch md:items-start md:flex-row">
        <div className="flex-1">
          {data.articles.length > 0 ? (
            data.articles.map(article => <Article key={article.id} {...article}></Article>)
          ) : (
            <Image src={empty} alt="空空如也" layout="responsive"></Image>
          )}
          <Pagination pagination={data.pagination} itemRender={paginationItemRender}></Pagination>
        </div>
        {data.categories.length <= 0 ? null : (
          <div className="flex-grow-0 my-4 md:my-0 md:ml-4 md:w-60">
            <CategoryList categories={props.data.categories} />
          </div>
        )}
      </main>
    </>
  );
}

export default layout(Index);
