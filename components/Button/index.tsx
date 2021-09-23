import React from 'react';
import { mergeClassNames } from '@util';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  block?: boolean;
}

const Button = (props: ButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
  const { children, className, block, ...rest } = props;

  const newClassName = mergeClassNames(styles.button, block ? styles.block : '', className);

  return (
    <button className={newClassName} ref={ref} {...rest}>
      {props.children}
    </button>
  );
};

export default React.forwardRef(Button);
