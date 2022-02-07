import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Input from 'components/base/Input';
import { getCaptcha, GetCaptchaResponse } from 'api';
import clientHttp from 'http/client';
import message from 'components/base/message';
import { errorHandler } from 'utils';

export interface InputCaptchaValue {
  key: string;
  text: string;
}

export interface InputCaptchaProps {
  value?: InputCaptchaValue;
  placeholder?: HTMLInputElement['placeholder'];
  onChange?: (value: InputCaptchaValue | undefined) => void;
}

export default function InputCaptcha(props: InputCaptchaProps) {
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState<GetCaptchaResponse | null>(null);
  const [text, setText] = useState('');

  const loadCaptcha = async () => {
    try {
      const { data } = await getCaptcha(clientHttp)();
      setCaptcha(data);
      const newValue = { key: data.key ?? '', text };
      triggerChange(newValue);
    } catch (error) {
      message.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerChange = (newValue: InputCaptchaValue) => {
    props.onChange?.(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = { key: captcha?.key ?? '', text: e.target.value };
    setText(e.target.value);
    triggerChange(newValue);
  };

  const handleClickCaptcha = () => {
    loadCaptcha();
  };

  return (
    <div className="flex flex-row align-center">
      <div className="relative w-64">
        <Input
          type="text"
          maxLength={6}
          placeholder="验证码"
          value={props.value?.text ?? text}
          onChange={handleChange}
        />
        <div className="absolute top-0 right-0 bottom-0 z-10" style={{ width: '100px' }}>
          <Image
            layout="fill"
            src={`data:image/jpeg;base64,${captcha?.data}`}
            alt="验证码"
            onClick={handleClickCaptcha}
            title="点击刷新"
          ></Image>
        </div>
      </div>
    </div>
  );
}
