import React, { useState } from 'react';
import { TooltipProps, Trigger } from '../Tooltip';
import Tooltip from '../Tooltip';
import Overlay, { OverlayProps } from './Overlay';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface PopConfirmProps extends Optional<TooltipProps, 'overlay'> {
  title?: string;
  onConfirm?: OverlayProps['onConfirm'];
  onCancel?: OverlayProps['onCancel'];
}

export default function PopConfirm(props: PopConfirmProps) {
  const [visible, setVisible] = useState(false);

  const defaultOverlay = <Overlay title={props.title} onConfirm={props.onConfirm} onCancel={props.onCancel}></Overlay>;
  const defaultPlacement = 'top';
  const defaultTrigger = ['click', 'focus'] as Trigger[];

  const {
    onConfirm,
    onCancel,
    placement = defaultPlacement,
    overlay = defaultOverlay,
    trigger = defaultTrigger,
    ...restProps
  } = props;

  const handleVisibleChange = (value: boolean) => {
    setVisible(value);
  };

  return (
    <Tooltip
      visible={visible}
      onVisibleChange={handleVisibleChange}
      overlay={overlay}
      placement={placement}
      trigger={trigger}
      {...restProps}
    >
      {props.children}
    </Tooltip>
  );
}
