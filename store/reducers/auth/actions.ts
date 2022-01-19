export const SIGNIN = 'SIGNIN';
export const SIGNOUT = 'SIGNOUT';

export function signin(user: User): PayloadAction<User> {
  return {
    type: SIGNIN,
    payload: user,
  };
}

export function signout(): Action {
  return {
    type: SIGNOUT,
  };
}
