import React from 'react';
import Layout from './Layout';
import AdminLayout from './LayoutAdmin';

interface PageConstructor {
  (props: any): JSX.Element;
  getLayout?: (page: React.ReactElement, pageProps: any) => React.ReactNode;
}

export function layout(pageCtor: PageConstructor): React.ReactNode {
  pageCtor.getLayout = (page: React.ReactElement, pageProps: any) => {
    return <Layout>{page}</Layout>;
  };
  return pageCtor;
}

export function layoutAdmin(pageCtor: PageConstructor): React.ReactNode {
  pageCtor.getLayout = (page: React.ReactElement, pageProps: any) => {
    return <AdminLayout title={pageProps.meta.title}>{page}</AdminLayout>;
  };
  return pageCtor;
}
