import React, { SyntheticEvent } from 'react';
import Dialog from 'rc-dialog';

export interface ModalBaseProps {
  visibleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export interface ModalProps {
  children?: React.ReactNode;
  title?: string;
  visible?: boolean;
  footer?: React.ReactNode;
  onClose?: (e: SyntheticEvent) => any;
}

export default function Modal(props: ModalProps) {
  return (
    <Dialog
      title={props.title}
      visible={props.visible}
      animation="zoom"
      maskAnimation="fade"
      footer={props.footer}
      onClose={props.onClose}
    >
      {props.children}
    </Dialog>
  );
}
