import merge from 'merge';
import { newHttp } from 'http/server';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type IncomingGSSP<P> = (ctx: GetServerSidePropsContext, user?: User) => Promise<P>;

type WithAuthServerSidePropsResult = GetServerSidePropsResult<{ [key: string]: any }>;

type WithAuthServerSidePropsOptions = {
  // any options you eventually would like to pass (required role...)
};

export function withAuthServerSideProps(
  incomingGSSP?: IncomingGSSP<WithAuthServerSidePropsResult>,
  options?: WithAuthServerSidePropsOptions
) {
  return async (ctx: GetServerSidePropsContext): Promise<WithAuthServerSidePropsResult> => {
    let user: User;
    try {
      const response = await newHttp(ctx).get<User>('/api/login/session', {
        headers: {
          Cookie: ctx.req.headers.cookie ?? false,
        },
      });
      user = response.data;
    } catch (error) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    }

    if (incomingGSSP) {
      const incomingGSSPResult = await incomingGSSP(ctx, user);

      if ('props' in incomingGSSPResult) {
        return {
          props: {
            ...incomingGSSPResult.props,
            initialReduxState: {
              auth: {
                user,
              },
            },
          },
        };
      }

      return incomingGSSPResult;
    }

    return {
      props: {
        initialReduxState: {
          auth: {
            user,
          },
        },
      },
    };
  };
}

export function shouldWithAuth(incomingGSSP?: IncomingGSSP<WithAuthServerSidePropsResult>) {
  return async (ctx: GetServerSidePropsContext): Promise<WithAuthServerSidePropsResult> => {
    const authRequest = newHttp(ctx)
      .get<User>('/api/login/session', {
        headers: {
          Cookie: ctx.req.headers.cookie ?? false,
        },
        // shouldWithAuth 不强制要求登录，因此这里提前捕获因为验证登录而产生的错误，使其不要被继续抛出
        // 并且直接返回 null, 使得未登录的情况下，user 的值设为 null
      })
      .catch(() => {
        return null;
      });

    const getServerSideProps = incomingGSSP?.(ctx) ?? Promise.resolve(null);

    const [authResponse, incomingGSSPResponse] = await Promise.all([authRequest, getServerSideProps]);
    const authServerSideProps = {
      props: {
        initialReduxState: {
          auth: {
            user: authResponse && authResponse.data,
          },
        },
      },
    };

    if (incomingGSSPResponse) {
      if ('props' in incomingGSSPResponse) {
        return merge.recursive(authServerSideProps, incomingGSSPResponse);
      }
      return incomingGSSPResponse;
    }
    return authServerSideProps;
  };
}
