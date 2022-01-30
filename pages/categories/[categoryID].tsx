import { GetServerSideProps } from 'next';
import Pagination, { ItemRender } from 'components/Pagination';
import Article from 'components/Article';
import CategoryList from 'components/CategoryList';
import { http } from 'http/server';
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

  const { categoryID, ...restQuery } = query;
  try {
    const categoriesRequest = http.get<CategoriesResponse>('/api/categories');
    const articlesRequest = http.get<ArticlesResponse>(`/api/categories/${categoryID}/articles`, {
      params: { ...restQuery },
    });
    const [categoriesResponse, articlesResponse] = await Promise.allSettled([categoriesRequest, articlesRequest]);

    // 获取所有分类失败，就应该直接返回 404
    if (categoriesResponse.status === 'rejected') {
      return {
        notFound: true,
      };
    }
    data.categories = categoriesResponse.value.data;
    // 获取文章成功，则覆盖初始化的值。若获取失败，不需要处理
    if (articlesResponse.status === 'fulfilled') {
      data.articles = articlesResponse.value.data.articles;
      data.pagination = articlesResponse.value.data.pagination;
    }
  } catch {
    // 不要把异常上抛来避免被 next 重定向到错误页面去
  }

  const cid = parseInt(categoryID as string);
  const category = data.categories.find(c => c.id == cid);

  // 如果没有找到当前的分类，直接返回 404
  if (category === undefined) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
      meta: {
        title: category.name,
      },
    },
  };
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

function Categories(props: IndexProps) {
  const { data } = props;

  return (
    <>
      <main className="flex flex-wrap flex-col items-stretch md:items-start md:flex-row">
        <div className="flex-1">
          {data.articles.length > 0 ? (
            data.articles.map(article => <Article key={article.id} {...article}></Article>)
          ) : (
            <Image src={empty} alt="空空如也"></Image>
          )}
        </div>
        <div className="flex-grow-0 my-4 md:my-0 md:ml-4 md:w-60">
          <CategoryList categories={props.data.categories} />
        </div>
      </main>
      <Pagination pagination={data.pagination} itemRender={paginationItemRender}></Pagination>
    </>
  );
}

export default layout(Categories);
