import React from 'react';
import { mergeClassNames } from '@util';
import styles from './Button.module.scss';

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  type?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  ghost?: boolean;
  block?: boolean;
  htmlType?: 'submit' | 'reset' | 'button';
  htmlForm?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {
  const { children, className, block, ghost = false, type = 'info' } = props;

  const newClassName = mergeClassNames(
    styles.button,
    styles[type],
    ghost ? styles.ghost : '',
    block ? styles.block : '',
    className
  );

  return (
    <button className={newClassName} type={props.htmlType} onClick={props.onClick} form={props.htmlForm}>
      {children}
    </button>
  );
};

export default Button;
