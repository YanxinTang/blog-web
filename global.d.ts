interface BaseModel {
  id: number;
  create_time: string;
  update_time: string;
}

interface User extends BaseModel {
  username: string;
}

interface Category extends BaseModel {
  name: string;
  edges: {
    articles?: Article[];
  };
}

interface Article extends BaseModel {
  title: string;
  content: string;
  categoryID: number;
  status: number;
  edges: {
    category?: Category;
  };
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

interface Setting extends BaseModel {
  key: string;
  value: string;
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
