import { mergeClassNames } from '@util';
import React from 'react';
import styles from './Line.module.scss';

export interface LineProps {
  percent: number;
  strokeColor?: string;
  trailColor?: string;
}

export default function Line(props: LineProps) {
  const { percent } = props;

  const bgClassName = mergeClassNames(styles['progress-bg'], percent === 100 ? 'rounded-r' : '');

  return (
    <div className={styles['progress-outer']}>
      <div
        className={styles['progress-inner']}
        style={{
          background: props.trailColor,
        }}
      >
        <div
          className={bgClassName}
          style={{
            width: `${percent}%`,
            background: props.strokeColor,
          }}
        >
          {percent}%
        </div>
      </div>
    </div>
  );
}
