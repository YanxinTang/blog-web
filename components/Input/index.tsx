import React from 'react';
import Textarea from './Textarea';
import Checkbox from '../Checkbox';
import InputCaptcha from '../InputCaptcha';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  return <input {...props} className={styles.input} />;
};

type BaseInputType = typeof Input;
interface InputInterface extends BaseInputType {
  Textarea: typeof Textarea;
  Checkbox: typeof Checkbox;
  Captcha: typeof InputCaptcha;
}

const inputDefaultExport = Input as InputInterface;
inputDefaultExport.Textarea = Textarea;
inputDefaultExport.Checkbox = Checkbox;
inputDefaultExport.Captcha = InputCaptcha;

export default inputDefaultExport;
