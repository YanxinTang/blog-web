import React from 'react';
import Textarea from './Textarea';
import Checkbox from '../Checkbox';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  return <input {...props} className={styles.input} />;
};

type BaseInputType = typeof Input;
interface InputInterface extends BaseInputType {
  Textarea: typeof Textarea;
  Checkbox: typeof Checkbox;
}

const inputDefaultExport = Input as InputInterface;
inputDefaultExport.Textarea = Textarea;

export default inputDefaultExport;
