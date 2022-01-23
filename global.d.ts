interface BaseModel {
  id: number;
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
  name: string;
}

interface Storage extends BaseModel {
  name: string;
  secretID: string;
  secretKey: string;
  token: string;
  region: string;
  endpoint: string;
  bucket: string;
  usage: number;
  capacity: number;
}

interface Pagination {
  page: number;
  perpage: number;
  total: number;
}

interface ResponseError {
  message: string;
}

interface FileObject {
  ETag: string;
  Key: string;
  LastModified: string;
  Size: number;
  StorageClass: string;
}
