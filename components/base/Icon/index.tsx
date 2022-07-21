import React from 'react';
import { mergeClassNames } from 'utils';
import { IconID } from './import';

interface IconProps {
  id: IconID;
  width?: number;
  height?: number;
  className?: string;
}

export default function Icon(props: IconProps) {
  const { id, width = 16, height = 16 } = props;
  return (
    <svg className={mergeClassNames('sprite-icon', props.className)} width={width} height={height} fill="currentColor">
      <use xlinkHref={`#${id}`} />
    </svg>
  );
}
