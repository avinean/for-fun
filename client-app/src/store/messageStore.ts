import { MessageStoreInterface } from '@/models/Store/MessageStoreInterface';
import { ElNotification } from 'element-plus';
import { INotificationOptions } from 'element-plus/lib/el-notification/src/notification.type';

const message = (options: Partial<INotificationOptions>) => { ElNotification(options); };

const success = (options: Partial<INotificationOptions>) => {
  message({
    title: 'Success',
    type: 'success',
    ...options,
  });
};

const warning = (options: Partial<INotificationOptions>) => {
  message({
    title: 'Warning',
    type: 'warning',
    ...options,
  });
};

const info = (options: Partial<INotificationOptions>) => {
  message({
    title: 'Info',
    type: 'info',
    ...options,
  });
};

const error = (options: Partial<INotificationOptions>) => {
  message({
    title: 'Error',
    type: 'error',
    ...options,
  });
};

export default {
  message,
  success,
  warning,
  info,
  error,
} as MessageStoreInterface;
