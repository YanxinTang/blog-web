import { Provider } from 'react-redux';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useStore } from '@store';
import { pageTitle } from '@util';
import Head from 'next/head';
import 'assets/styles/globals.css';
import 'assets/styles/markdown.css';
import 'assets/styles/animation.css';

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
        <title>{pageTitle(process.env.NEXT_PUBLIC_SITE_NAME, meta.title)}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet" />
      </Head>
      <Provider store={store}>{getLayout(<Component {...pageProps} />, pageProps)}</Provider>
    </>
  );
}

export default MyApp;
