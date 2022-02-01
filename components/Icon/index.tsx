import React from 'react';
import { IconID } from './import';

interface IconProps {
  id: IconID;
  size?: number;
}

export default function Icon(props: IconProps) {
  const { id, size = 16 } = props;
  return (
    <svg className="sprite-icon" width={size} height={size} fill="currentColor">
      <use xlinkHref={`#${id}`} />
    </svg>
  );
}
