import { loadavg } from 'os';
import React from 'react';
import { mergeClassNames } from 'utils';
import Icon from '../Icon';
import styles from './Button.module.scss';

type ButtonProps = React.PropsWithChildren<{
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  htmlForm?: string;
  title?: string;
  theme?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  ghost?: boolean;
  block?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}>;

const Button = (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { children, className, block, ghost = false, theme = 'info', htmlForm, loading, ...restProps } = props;

  const newClassName = mergeClassNames(
    styles.button,
    styles[theme],
    ghost ? styles.ghost : '',
    block ? styles.block : '',
    className
  );

  return (
    <button ref={ref} className={newClassName} form={htmlForm} {...restProps}>
      {loading && <Icon id="loading" width={32} className="absolute inset-0 m-auto" />}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>{children}</span>
    </button>
  );
};

export default React.forwardRef<HTMLButtonElement, ButtonProps>(Button);
