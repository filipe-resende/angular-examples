import {
  Notification,
  PanicAlertNotification
} from '../../shared/models/notification';
import { Thing } from '../../shared/models/thing';

export class UpdateNotifications {
  public static readonly type = '[NOTIFICATIONS] UpdateNotifications';

  constructor(public updatedNotifications: Notification[]) {}
}

export class UpdateLastFilterButtonPanic {
  public static readonly type = '[string] updateLastFilterButtonPanic';

  constructor(public lastFilterPanicButton: string) {}
}

export class UpdatePanicButtonNotifications {
  public static readonly type =
    '[NOTIFICATIONS] UpdatePanicButtonNotifications';

  constructor(
    public updatedPanicButtonNotifications: PanicAlertNotification[]
  ) {}
}

export class UpdateExpiredThings {
  public static readonly type = '[THINGS] UpdateExpiredThings';

  constructor(public expiredThings: Thing[]) {}
}
