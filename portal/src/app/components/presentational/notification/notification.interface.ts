import { ComponentType } from '@angular/cdk/portal';

export interface INotification {
  titleClass?: string;
  positionClass?: string;
  messageClass?: string;
  notificationClass?: string;
  closeButton?: boolean;
  iconClasses?: INotificationIconClasses;
  notificationComponent?: ComponentType<any>;
}

export interface INotificationIconClasses {
  error?: string;
  info?: string;
  success?: string;
  warning?: string;
  disclaim?: string;
}
