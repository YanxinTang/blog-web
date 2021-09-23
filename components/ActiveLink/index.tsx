import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { mergeClassNames } from '@util';
import styles from './ActiveLink.module.css';

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
}

const nodeIsReactElement = (node: React.ReactNode): node is React.ReactElement => {
  return typeof node === 'object';
};

const isActive = (path: string, href: string) => {
  return path === href;
};

export default function ActiveLink({ children, ...props }: ActiveLinkProps) {
  const router = useRouter();
  const { asPath, pathname } = router;
  const child = React.Children.only(children);

  if (!nodeIsReactElement(child)) {
    return <Link {...props}>{children}</Link>;
  }

  const className = mergeClassNames(child.props.className, isActive(asPath, props.href) ? styles.active : '');

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}
