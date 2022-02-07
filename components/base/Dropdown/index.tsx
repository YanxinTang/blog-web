import React, { useRef, useState } from 'react';
import styles from './Dropdown.module.css';
import Overlay, { Placement } from './Overlay';
import type { DropdownOption } from './Overlay';

export type { DropdownOption };

export interface DropdownProps {
  children: React.ReactNode;
  placement?: Placement;
  options?: DropdownOption[];
}

export default function Dropdown(props: DropdownProps) {
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [show, setShow] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { placement = 'bottom-left' } = props;

  const handleClickTrigger = () => {
    setShow(show => !show);
    if (!overlayMounted) {
      setOverlayMounted(true);
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={handleClickTrigger}>
        {props.children}
      </div>
      {props.options && overlayMounted && (
        <Overlay
          show={show}
          setShow={setShow}
          options={props.options}
          placement={placement}
          dropdownRef={dropdownRef}
        ></Overlay>
      )}
    </div>
  );
}
