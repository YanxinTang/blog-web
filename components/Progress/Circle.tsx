import React from 'react';
import styles from './Circle.module.scss';

export interface CircleOnlyProps {
  size?: string;
  strokeWidth?: number;
}

export interface CircleProps extends CircleOnlyProps {
  children?: React.ReactNode;
  percent: number;
  strokeColor?: string;
  trailColor?: string;
}

export default function Circle(props: CircleProps) {
  const { strokeColor = '#4f45e4', trailColor = '#CCCCCC', size = '100px', strokeWidth = 6 } = props;
  const radius = 50 - strokeWidth / 2;
  const len = Math.PI * 2 * radius;
  const strokeDasharray = `${(props.percent / 100) * (len - 0)}px ${len}px`;

  let beginPositionX = 0;
  let beginPositionY = -radius;
  let endPositionX = 0;
  let endPositionY = -2 * radius;

  const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
  a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
  a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;

  return (
    <div className={styles.circle} style={{ width: size, height: size }}>
      <svg className={styles['progress__circle']} viewBox="0 0 100 100">
        <path
          d={pathString}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          fillOpacity="0"
          style={{ stroke: trailColor }}
        ></path>
        <path
          d={pathString}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          opacity="1"
          fillOpacity="0"
          style={{ stroke: strokeColor, strokeDasharray }}
        ></path>
      </svg>
      <span className={styles['progress__text']}>{props.children}</span>
    </div>
  );
}
