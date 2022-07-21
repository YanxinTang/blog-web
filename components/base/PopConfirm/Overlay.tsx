import React from 'react';
import Button from '../Button';
import Icon from '../Icon';

export interface OverlayProps {
  title?: string;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => any;
}

export default function Overlay(props: OverlayProps) {
  return (
    <div>
      <p>{props.title}</p>
      <div className="text-right space-x-2">
        <Button theme="blue" onClick={props.onConfirm}>
          确认
        </Button>
        <Button theme="blue" ghost onClick={props.onCancel}>
          取消
        </Button>
      </div>
    </div>
  );
}
