import { Axios } from 'axios';

/*
 * 获取草稿详情
 */
export type GetDraftResponse = Article;

export function getDraft(http: Axios) {
  return (draftID: number | string) => {
    return http.get<GetDraftResponse>(`/api/admin/drafts/${draftID}`);
  };
}
