import { INotificationHandle, INotificationOptions } from 'element-plus/lib/el-notification/src/notification.type';

export interface MessageStoreInterface {
  message: (options: Partial<INotificationOptions>) => INotificationHandle,
  success: (options: Partial<INotificationOptions>) => void,
  warning: (options: Partial<INotificationOptions>) => void,
  info: (options: Partial<INotificationOptions>) => void,
  error: (options: Partial<INotificationOptions>) => void,
};
