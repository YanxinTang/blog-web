import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { mergeClassNames } from 'utils';

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode | ((active: Boolean) => React.ReactNode);
  href: string;
  activeClassName?: string;
  exact?: boolean;
}

const childrenIsFunction = (children: ActiveLinkProps['children']): children is Function => {
  return typeof children === 'function';
};

const nodeIsReactElement = (node: React.ReactNode): node is React.ReactElement => {
  return typeof node === 'object';
};

const isActive = (exact: boolean, path: string, href: string) => {
  if (exact) {
    return path === href;
  }
  return path.includes(href);
};

export default function ActiveLink(props: ActiveLinkProps) {
  const router = useRouter();
  const { asPath } = router;
  const { children, activeClassName = 'active', exact = false, ...restProps } = props;
  const linkIsActive = isActive(exact, asPath, props.href);

  if (childrenIsFunction(children)) {
    return <Link {...restProps}>{children(linkIsActive)}</Link>;
  }

  const child = React.Children.only(children);
  if (!nodeIsReactElement(child)) {
    return <Link {...restProps}>{children}</Link>;
  }

  const className = mergeClassNames(child.props.className, linkIsActive ? activeClassName : '');
  return <Link {...restProps}>{React.cloneElement(child, { className })}</Link>;
}
