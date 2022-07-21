import React from 'react';
import RcTooltip from 'rc-tooltip';

export type Placement =
  | 'top'
  | 'topLefp'
  | 'topRight'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom';

export type Trigger = 'hover' | 'click' | 'focus';

export interface TooltipProps {
  children?: React.ReactElement;
  overlay: React.ReactNode;
  placement?: Placement;
  trigger?: Trigger | Trigger[];
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
}

export default function Tooltip(props: TooltipProps) {
  return (
    <RcTooltip prefixCls="blog-tooltip" arrowContent={<div className="blog-tooltip-arrow-inner"></div>} {...props}>
      {props.children}
    </RcTooltip>
  );
}
