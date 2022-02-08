import type { ParsedUrlQuery } from 'querystring';
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Crumb from './Crumb';

const _defaultGetTextGenerator = () => null;
const _defaultGetDefaultTextGenerator = (path: string) => path;

const splitPath = (path: string) => {
  const pathWithoutQuery = path.split('?')[0];
  return pathWithoutQuery.split('/').filter(v => v.length > 0);
};

export interface BreadcrumbProps {
  omitroot?: boolean;
  getTextGenerator?: (param: string, query: ParsedUrlQuery) => null | (() => string | Promise<string>);
  getDefaultTextGenerator?: (param: string, query: ParsedUrlQuery) => string;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  const router = useRouter();

  const {
    omitroot = false,
    getDefaultTextGenerator = _defaultGetDefaultTextGenerator,
    getTextGenerator = _defaultGetTextGenerator,
  } = props;

  const crumbs = useMemo(() => {
    const asPathNodeNames = splitPath(router.asPath);
    const pathNodeNames = splitPath(router.pathname);

    const crumblist = pathNodeNames.map((name, idx) => {
      // Pull out and convert "[post_id]" into "post_id"
      const param = name.replace('[', '').replace(']', '');
      const href = '/' + asPathNodeNames.slice(0, idx + 1).join('/');

      return {
        href,
        textGenerator: getTextGenerator(param, router.query),
        defaultText: getDefaultTextGenerator(param, router.query),
        last: idx === pathNodeNames.length - 1,
      };
    });

    if (omitroot && pathNodeNames.length > 1) {
      crumblist.shift();
    }

    return crumblist;
  }, [omitroot, getDefaultTextGenerator, getTextGenerator, router]);

  return (
    <ul className="list-none flex flex-row" aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <Crumb
          key={crumb.defaultText}
          text={crumb.defaultText}
          href={crumb.href}
          textGenerator={crumb.textGenerator}
          last={crumb.last}
        ></Crumb>
      ))}
    </ul>
  );
}
