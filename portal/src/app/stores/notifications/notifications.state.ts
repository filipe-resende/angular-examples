import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  Notification,
  PanicAlertNotification
} from '../../shared/models/notification';
import { Thing } from '../../shared/models/thing';
import {
  UpdateExpiredThings,
  UpdateLastFilterButtonPanic,
  UpdateNotifications,
  UpdatePanicButtonNotifications
} from './notifications.actions';

export class NotificationsStateModel {
  public hasNotifications: boolean;

  public notifications: Notification[];

  public panicButtonNotifications: PanicAlertNotification[];

  public expiredThings: Thing[];

  public lastFilterPanicButton: string;
}

const INITIAL_STATE: NotificationsStateModel = {
  hasNotifications: false,
  notifications: [],
  panicButtonNotifications: [],
  expiredThings: [],
  lastFilterPanicButton: null
};

@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: INITIAL_STATE
})
export class NotificationsState {
  @Selector()
  public static notifications(state: NotificationsStateModel): Notification[] {
    return state.notifications;
  }

  @Selector()
  public static panicButtonnotifications(
    state: NotificationsStateModel
  ): PanicAlertNotification[] {
    return state.panicButtonNotifications;
  }

  @Selector()
  public static hasNotifications(state: NotificationsStateModel): boolean {
    return state.hasNotifications;
  }

  @Selector()
  public static expiredThings(state: NotificationsStateModel): Thing[] {
    return state.expiredThings;
  }

  @Selector()
  public static lastFilterPanicButton(state: NotificationsStateModel): string {
    return state.lastFilterPanicButton;
  }

  @Action(UpdateNotifications)
  public updateNotifications(
    { patchState }: StateContext<NotificationsStateModel>,
    { updatedNotifications }: UpdateNotifications
  ): void {
    const [notSeenNotification] = updatedNotifications.filter(
      notification => !notification.seen
    );

    patchState({
      notifications: [...updatedNotifications],
      hasNotifications: !!notSeenNotification
    });
  }

  @Action(UpdatePanicButtonNotifications)
  public updatePanicButtonNotifications(
    { patchState }: StateContext<NotificationsStateModel>,
    { updatedPanicButtonNotifications }: UpdatePanicButtonNotifications
  ): void {
    patchState({
      panicButtonNotifications: [...updatedPanicButtonNotifications]
    });
  }

  @Action(UpdateExpiredThings)
  public updateExpiredThings(
    { patchState }: StateContext<NotificationsStateModel>,
    { expiredThings }: UpdateExpiredThings
  ): void {
    patchState({
      expiredThings
    });
  }

  @Action(UpdateLastFilterButtonPanic)
  public updateLastFilterButtonPanic(
    { patchState }: StateContext<NotificationsStateModel>,
    { lastFilterPanicButton }: UpdateLastFilterButtonPanic
  ): void {
    patchState({
      lastFilterPanicButton
    });
  }
}
