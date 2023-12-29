import { NotificationType } from '../enums/notificationType';
import { BatteryState } from '../enums/batteryState';
import { Coordinates } from './coordinates';

export interface PanicAlertNotificationComment {
  dateTime: string;
  nameThing: string;
  text: string;
}
export interface Notification {
  type: NotificationType;
  eventDate: Date;
  description?: string;
  id?: string;
  seen?: boolean;
  totalSent?: number;
  text?: string;
  device?: string;
  deviceType?: string;
  batteryState?: BatteryState;
  batteryPercent?: string;
  location?: Coordinates;
  sourceApplicationId?: string;
  sourceApplicationName?: string;
  status?: string;
  reason?: 'Other' | 'Real' | 'Falsy';
  thing?: {
    name: string;
    iamId?: string;
    document?: string;
    passport?: string;
    company?: string;
  };
  areaName?: string;
  middleware?: string;
}
export interface PanicAlertNotification extends Notification {
  attendedBy?: string;
  attendedEndedBy?: string;
  alarmType?: boolean;
  commentary?: string;
  comments?: PanicAlertNotificationComment[];
  attendanceDateTime?: string;
  attendanceEndedDateTime?: string;
}

export function isNotificationsEqual(
  notification1: Notification,
  notification2: Notification
): boolean {
  return (
    notification1.deviceType === notification2.deviceType &&
    notification1.thing.name === notification2.thing.name &&
    notification1.device === notification2.device
  );
}
