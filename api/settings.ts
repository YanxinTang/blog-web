import { Axios } from 'axios';

export function upsertSettings(http: Axios) {
  return (pairs: { key: string; value: string }[]) => {
    return http.post<Setting[]>('/api/admin/settings', pairs);
  };
}

export function getPublicSettings(http: Axios) {
  return (keys: string[]) => {
    return http.get<Setting[]>('/api/settings', { params: { keys } });
  };
}

export function getPublicsetting(http: Axios) {
  return async (key: string) => {
    const { data } = await getPublicSettings(http)([key])
    return {
      data: data[0]
    }
  }
}

export function getSettings(http: Axios) {
  return (keys: string[]) => {
    return http.get<Setting[]>('/api/admin/settings', { params: { keys } });
  };
}
