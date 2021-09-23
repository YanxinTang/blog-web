interface BaseModel {
  id: number
  updatedAt: string;
  createdAt: string;
}

interface User extends User {
  username: string;
}

interface Category extends BaseModel {
  name: string;
}

interface Article extends BaseModel {
  title: string;
  content: string;
  categoryID: number;
  category: Category;
}

interface Comment extends BaseModel {
  articleID: number;
  username: string;
  content: string;
  parentCommentID: number;
}

interface Category extends BaseModel {
  name: string
}

interface Pagination {
  page: number;
  perpage: number;
  total: number;
}

interface ResponseError {
  message: string;
}