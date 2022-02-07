import React from 'react';
import Line, { LineProps } from './Line';
import Circle, { CircleProps } from './Circle';
import { omit } from 'utils';

export interface ProgressProps extends LineProps, CircleProps {
  type?: 'line' | 'circle';
}

export default function Progress(props: ProgressProps) {
  const { type = 'line', ...restProps } = props;

  let child;
  if (type === 'line') {
    child = <Line {...omit(restProps, ['size'])}></Line>;
  } else if (type === 'circle') {
    child = <Circle {...restProps}></Circle>;
  }

  return <div className="progress">{child}</div>;
}
