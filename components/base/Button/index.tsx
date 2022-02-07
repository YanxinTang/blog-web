import React from 'react';
import { mergeClassNames } from 'utils';
import styles from './Button.module.scss';

type ButtonProps = React.PropsWithChildren<{
  className?: string;
  type?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  ghost?: boolean;
  block?: boolean;
  htmlType?: 'submit' | 'reset' | 'button';
  htmlForm?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}>;

const Button = (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { children, className, block, ghost = false, type = 'info' } = props;

  const newClassName = mergeClassNames(
    styles.button,
    styles[type],
    ghost ? styles.ghost : '',
    block ? styles.block : '',
    className
  );

  return (
    <button
      ref={ref}
      className={newClassName}
      type={props.htmlType}
      onClick={props.onClick}
      form={props.htmlForm}
      disabled={props.disabled}
    >
      {children}
    </button>
  );
};

export default React.forwardRef<HTMLButtonElement, ButtonProps>(Button);
