import Cookies from 'js-cookie'
import { SIGNIN } from './reducers/auth';

export const authMiddleware = api => next => action => {
  // if (action.type === SET_TOKEN) {
  //   wx.setStorageSync('token', action.token);
  //   http.setHeader('Authorization', `Bearer ${action.token}`);
  // }
  if (action.type === SIGNIN) {
    console.log(action.payload)
    Cookies.set('token', action.payload.token);
    Cookies.set('refreshToken', action.payload.refreshToken);
    // http.setHeader('Authorization', `Bearer ${action.token}`);
  }
  // if (action.type === SIGNOUT) {
  //   wx.removeStorageSync('token');
  //   wx.removeStorageSync('refreshToken');
  //   http.deleteHeader('Authorization');
  // }
  return next(action);
}