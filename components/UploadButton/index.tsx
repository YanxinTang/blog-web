import React, { useRef } from 'react';
import Button from 'components/Button';

export interface UploadButton {
  children?: React.ReactNode;
  onFiles?: (files: File[]) => void;
}

export default function UploadButton(props: UploadButton) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      files.push(file);
    }
    props.onFiles?.(files);
  };

  return (
    <Button onClick={handleClick} type="green">
      {props.children}
      <input ref={inputRef} onChange={handleChange} type="file" multiple className="w-0 h-0 invisible" />
    </Button>
  );
}
