import React from 'react';
import Line from './Line';

export interface ProgressProps {
  type?: 'line';
  percent: number;
  strokeColor?: string;
  trailColor?: string;
}

export default function Progress(props: ProgressProps) {
  const { type = 'line', ...restProps } = props;

  let child;
  if (type === 'line') {
    child = <Line {...restProps}></Line>;
  }

  return <div className="progress">{child}</div>;
}
