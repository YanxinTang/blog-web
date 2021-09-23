import Notification, { NoticeProps, NotificationInstance } from './Notification';

let messageInstance: NotificationInstance;

type GetMessageInstanceCallback = (instance: NotificationInstance) => void;
const getMessageInstance = (callback: GetMessageInstanceCallback) => {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }

  Notification.newInstance(instance => {
    messageInstance = instance;
    callback(instance);
  });
};

type MessageOption = Omit<NoticeProps, 'key'>;
const notify = (option: MessageOption) => {
  getMessageInstance(instance => {
    instance.notify(option);
  });
};

type TypeMessageOption = Omit<MessageOption, 'type'> | string;
const typedNotify = (option: TypeMessageOption, type: NoticeProps['type']) => {
  if (typeof option === 'string') {
    notify({ message: option, type });
    return;
  }
  notify({ ...option, type });
};
const success = (option: TypeMessageOption) => {
  typedNotify(option, 'success');
};
const info = (option: TypeMessageOption) => {
  typedNotify(option, 'info');
};
const warn = (option: TypeMessageOption) => {
  typedNotify(option, 'warning');
};
const error = (option: TypeMessageOption) => {
  typedNotify(option, 'error');
};

const message = {
  notify,
  success,
  info,
  warn,
  error,
};

export default message;
