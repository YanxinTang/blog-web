import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './Overlay.module.css';
import domAlign from 'dom-align';

export type Placement = 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface DropdownOption {
  key: React.Key;
  text: string;
  onClick: () => void;
}

interface OverlayProps {
  dropdownRef: React.RefObject<HTMLDivElement>;
  placement: Placement;
  show: boolean;
  options: DropdownOption[];
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Overlay = (props: OverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { show, setShow, options } = props;

  useEffect(() => {
    const dropdownElement = props.dropdownRef.current;
    const overlayElement = overlayRef.current;
    const onWindowResize = () => {
      if (dropdownElement) {
        const alignConfig = {
          points: ['tr', 'br'], // align top left point of sourceNode with top right point of targetNode
          offset: [0, 10],
          overflow: { adjustX: true, adjustY: true }, // auto adjust position when sourceNode is overflowed
        };
        domAlign(overlayElement, dropdownElement, alignConfig);
      }
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [props.dropdownRef]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const dropdownElement = props.dropdownRef.current;
      const overlayElement = overlayRef.current;
      const target = event.target as Node;
      if (!dropdownElement?.contains(target) && !overlayElement?.contains(target)) {
        setShow(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [props.dropdownRef, setShow]);

  const handleClickOption = (option: DropdownOption) => {
    option.onClick?.();
    setShow(false);
  };

  return ReactDOM.createPortal(
    <div style={{ position: 'absolute', width: '100%', top: 0, zIndex: 9999 }}>
      <div
        className="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        style={{ display: show ? 'block' : 'none' }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        ref={overlayRef}
      >
        <div className="py-1" role="none">
          {options.map(option => (
            <span
              key={option.key}
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              tabIndex={-1}
              onClick={() => handleClickOption(option)}
            >
              {option.text}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Overlay;
