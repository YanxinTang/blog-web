import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { mergeClassNames } from 'utils';

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode | ((active: Boolean) => React.ReactNode);
  href: string;
  activeClassName?: string;
}

const childrenIsFunction = (children: ActiveLinkProps['children']): children is Function => {
  return typeof children === 'function';
};

const nodeIsReactElement = (node: React.ReactNode): node is React.ReactElement => {
  return typeof node === 'object';
};

const isActive = (path: string, href: string) => {
  return path === href;
};

export default function ActiveLink({ children, ...props }: ActiveLinkProps) {
  const router = useRouter();
  const { asPath } = router;
  const linkIsActive = isActive(asPath, props.href);

  if (childrenIsFunction(children)) {
    return <Link {...props}>{children(linkIsActive)}</Link>;
  }

  const child = React.Children.only(children);
  const activeClassName = props.activeClassName ?? 'active';
  if (!nodeIsReactElement(child)) {
    return <Link {...props}>{children}</Link>;
  }

  const className = mergeClassNames(child.props.className, linkIsActive ? activeClassName : '');
  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}
