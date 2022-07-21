import { Axios } from 'axios';

export interface CrateArticleInput {
  categoryID: Article['categoryID'];
  title: Article['title'];
  content: Article['content'];
  status: Article['status'];
}

export function createArticle(http: Axios) {
  return (cai: CrateArticleInput) => {
    return http.post<Article>('/api/admin/articles', cai);
  };
}

export function publishArticle(http: Axios) {
  return (input: Omit<CrateArticleInput, 'status'>) => {
    return createArticle(http)({ ...input, status: 1 });
  };
}

export function draftArticle(http: Axios) {
  return (input: Omit<CrateArticleInput, 'status'>) => {
    return createArticle(http)({ ...input, status: 2 });
  };
}

export function deleteArticle(http: Axios) {
  return (id: BaseModel['id']) => {
    return http.delete(`/api/admin/articles/${id}`);
  };
}

export interface UpdateArticleInput {
  categoryID?: Article['categoryID'];
  title?: Article['title'];
  content?: Article['content'];
  status?: Article['status'];
}

export function updateArticle(http: Axios) {
  return (id: Article['id'], input: UpdateArticleInput) => {
    return http.put<Article>(`/api/admin/articles/${id}`, input);
  };
}

/*
 * 管理员获取文章详情
 */
export function getArticle(http: Axios) {
  return (draftID: number | string) => {
    return http.get<Article>(`/api/admin/articles/${draftID}`);
  };
}

/**
 * 管理员获取所有文章列表
 */
export interface GetArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

interface GetArticlesInput {
  categoryID: number;
  status: number;
  page: number | string;
}

export function getArticles(http: Axios) {
  return (input: GetArticlesInput) => {
    return http.get<GetArticlesResponse>('/api/admin/articles', {
      params: input,
    });
  };
}
