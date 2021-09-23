import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Checkbox(props: CheckboxProps) {
  return <input type="checkbox" {...props} className={styles.checkbox} />;
}
