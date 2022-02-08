import { Axios } from 'axios';

/*
 * 获取验证码
 */
export interface GetCaptchaResponse {
  key: string;
  data: string;
}

export function getCaptcha(http: Axios) {
  return function () {
    return http.get<GetCaptchaResponse>('/api/captcha');
  };
}
