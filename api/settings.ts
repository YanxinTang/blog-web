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

export function getSettings(http: Axios) {
  return (keys: string[]) => {
    return http.get<Setting[]>('/api/admin/settings', { params: { keys } });
  };
}
