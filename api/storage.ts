import { Axios } from 'axios';

export type OverviewStorageList = Array<{
  id: number;
  name: string;
  usage: number;
  capacity: number;
}>;

export function getStorageOverview(http: Axios) {
  return () => {
    return http.get<OverviewStorageList>('/api/admin/overview/storage');
  };
}

/*
 * 获取对象存储详细描述
 */
export type GetStorageResponse = Storage;

export function getStorage(http: Axios) {
  return (storageID: number | string) => {
    return http.get<GetStorageResponse>(`/api/admin/storages/${storageID}`);
  };
}

/*
 * 获取对象存储文件目录列表
 */
export interface GetStorageObjectsResponse {
  CommonPrefixes: string | null;
  Contents: FileObject[];
  ContinuationToken: string | null;
  Delimiter: string | null;
  EncodingType: string | null;
  IsTruncated: boolean;
  KeyCount: number;
  MaxKeys: number;
  Name: string;
  NextContinuationToken: string;
  Prefix: string;
  StartAfter: string | null;
}

export function getStorageObjects(http: Axios) {
  return (storageID: number | string) => {
    return http.get<GetStorageObjectsResponse>(`/api/admin/storages/${storageID}/objects`);
  };
}
