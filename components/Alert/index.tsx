import React from 'react';
import styles from './Alert.module.css';
import successIcon from './success.svg';
import { mergeClassNames } from '@util';

export type AlertProps = {
  type?: 'success' | 'info' | 'warning' | 'error';
  children: string;
};

const alertTheme = {
  success: styles.success,
  info: styles.info,
  warning: styles.warning,
  error: styles.error,
};

export default function Alert(props: AlertProps) {
  // const Icon = successIcon;

  const className = props.type ? alertTheme[props.type] : alertTheme.success;

  return (
    <div className={mergeClassNames(styles.alert, className)}>
      {/* <Icon /> */}
      <span className={styles.alertText}>{props.children}</span>
    </div>
  );
}
