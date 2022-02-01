import { Provider } from 'react-redux';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useStore } from 'store';
import { pageTitle } from 'utils';
import Head from 'next/head';
import ConfigProvider from 'components/ConfigProvider';
import 'assets/styles/globals.css';
import 'assets/styles/markdown.css';
import 'assets/styles/animation.css';
import 'assets/styles/Modal.scss';
import 'components/Icon/import';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement, pageProps: any) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const initPageMeta = {
  title: '',
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const store = useStore(pageProps.initialReduxState);

  const getLayout = Component.getLayout ?? (page => page);
  const { meta = initPageMeta } = pageProps;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <title>{pageTitle(process.env.NEXT_PUBLIC_SITE_NAME, meta.title)}</title>
      </Head>
      <Provider store={store}>
        <ConfigProvider>{getLayout(<Component {...pageProps} />, pageProps)}</ConfigProvider>
      </Provider>
    </>
  );
}

export default MyApp;
