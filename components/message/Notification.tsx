import { mergeClassNames } from '@util';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Notify.module.css';

let id = 0;

export interface NoticeProps {
  key?: React.Key;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const Notice = (props: NoticeProps) => {
  const { onClose } = props;
  useEffect(() => {
    window.setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1500);
  });

  return (
    <div className="m-2 flex justify-center content-center w-full">
      <div
        className={mergeClassNames(
          'border px-4 py-3 rounded flex flex-row flex-nowrap justify-start items-center',
          styles[props.type]
        )}
        role="alert"
      >
        <strong className="font-bold">!!!</strong>
        <span className="block sm:inline">{props.message}</span>
        <span className="pl-2">
          <svg
            className="fill-current h-6 w-6 text-red-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

interface NotificationProps {}

interface NotificationState {
  notices: NoticeProps[];
}

export interface NotificationInstance {
  notify: (props: NoticeProps) => void;
}

type NewInstanceCallback = (instance: NotificationInstance) => void;

export default class Notification extends React.Component<NotificationProps, NotificationState> {
  constructor(props: NotificationProps) {
    super(props);
    this.state = {
      notices: [],
    };
  }

  add = (props: NoticeProps) => {
    props.key = id++;
    this.setState(state => {
      return {
        notices: [...state.notices, props],
      };
    });
  };

  remove = (key: React.Key) => {
    this.setState(({ notices }) => {
      return {
        notices: notices.filter(notice => notice.key !== key),
      };
    });
  };

  render() {
    const { notices } = this.state;

    return (
      <TransitionGroup
        className="notification-container fixed top-0 z-50 w-full flex flex-col justify-start content-center"
        style={{ pointerEvents: 'none' }}
        appear={true}
      >
        {notices.map(noticeProps => {
          const onClose = () => {
            this.remove(noticeProps.key as React.Key);
          };
          const { key, ...restProps } = noticeProps;

          return (
            <CSSTransition key={key} timeout={200} classNames="fade-in-down">
              <Notice {...restProps} onClose={onClose} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }

  static newInstance(callback: NewInstanceCallback) {
    const div = document.createElement('div');
    document.body.append(div);
    let called = false;
    const ref = (instance: Notification) => {
      if (called) {
        return;
      }
      called = true;
      callback({
        notify(props: NoticeProps) {
          instance.add(props);
        },
      });
    };
    ReactDOM.render(<Notification ref={ref} />, div);
  }
}
