import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as _ from 'lodash';
import {
  NotificationsState,
  NotificationsStateModel
} from './notifications.state';
import {
  Notification,
  isNotificationsEqual,
  PanicAlertNotification
} from '../../shared/models/notification';
import {
  UpdateExpiredThings,
  UpdateNotifications,
  UpdatePanicButtonNotifications,
  UpdateLastFilterButtonPanic
} from './notifications.actions';
import { ThingsService } from '../things/things.service';
import { NotificationType } from '../../shared/enums/notificationType';
import { getBatteryState, BatteryState } from '../../shared/enums/batteryState';
import { Coordinates } from '../../shared/models/coordinates';
import { SitesService } from '../sites/sites.service';
import {
  NotificationApiGetModel,
  NotificationModel,
  NotificationRepository
} from '../../core/repositories/notification.repository';
import { PaginatedModel } from '../../shared/models/paginatedModel';
import { formatDateAsUTC } from '../../shared/utils/date';
import { LocationEventsRepository } from '../../core/repositories/location-events.repository';
import { Thing } from '../../shared/models/thing';
import { ThingsExpirationSearchParams } from '../../shared/models/things-search-params';
import { UserProfileService } from '../user-profile/user-profile.service';

const TWELVE_HOURS_IN_MINUTES = 720;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private getNotificationsByDateSubscription: Subscription = new Subscription();

  private getPanicButtonNotificationsSubscription: Subscription =
    new Subscription();

  @Select(NotificationsState.notifications)
  public notifications$: Observable<Notification[]>;

  @Select(NotificationsState.panicButtonnotifications)
  public panicButtonNotifications$: Observable<PanicAlertNotification[]>;

  @Select(NotificationsState.hasNotifications)
  public hasNotifications$: Observable<boolean>;

  @Select(NotificationsState.expiredThings)
  public expiredThings$: Observable<Thing[]>;

  @Select(NotificationsState.lastFilterPanicButton)
  public lastFilterPanicButton$: Observable<string>;

  constructor(
    private store: Store,
    private userProfileService: UserProfileService,
    private thingsService: ThingsService,
    private sitesService: SitesService,
    private notificationRepository: NotificationRepository,
    private locationEventsRepository: LocationEventsRepository
  ) {}

  public getStore(): NotificationsStateModel {
    return this.store.snapshot().notifications as NotificationsStateModel;
  }

  /**
   * Atualiza o STATE "notifications" com as novas notificações obtidas. Sobreescreve o array atual.
   * @param notifications notificações que serão listadas
   */
  @Dispatch()
  private updateNotifications(notifications: Notification[]) {
    const notificationsOrdered = _.orderBy(
      notifications,
      ['eventDate'],
      ['desc']
    );
    const notificationsUniq = _.uniqBy(notificationsOrdered, 'device');
    return new UpdateNotifications(notificationsUniq);
  }

  /**
   * Atualiza o STATE "panicButtonNotifications" com as novas notificações de botao de panico obtidas. Sobreescreve o array atual.
   * @param notifications notificações do tipo botao de panico que serão listadas
   */
  @Dispatch()
  private updatePanicButtonNotifications(
    notifications: PanicAlertNotification[]
  ) {
    return new UpdatePanicButtonNotifications(notifications);
  }

  @Dispatch()
  public updateLastFilterButtonPanic(status: string) {
    return new UpdateLastFilterButtonPanic(status);
  }

  @Dispatch()
  public updateExpiredThings(
    expiredThingsAsPaginatedList: Thing[]
  ): UpdateExpiredThings {
    return new UpdateExpiredThings(expiredThingsAsPaginatedList);
  }

  /**
   * Obtém as últimas notificações (mais recentes) por data/hora, dentro das que estão no STATE
   * @param amount quantidade de registros que devem ser retornados. Padrão é 5.
   */
  public getLastNotificationsFromState(amount = 5): Notification[] {
    const { notifications } = this.getStore();

    const notSeenNotifications = notifications.filter(
      notification => !notification.seen
    );
    const orderedNotifications = [...notSeenNotifications].sort(
      (a, b) => b.eventDate.getTime() - a.eventDate.getTime()
    );

    return orderedNotifications.length > amount
      ? orderedNotifications.slice(0, amount)
      : orderedNotifications;
  }

  public setNotificationSeen(notificationToBeUpdated: Notification): void {
    if (this.isNotificationAlreadyListed(notificationToBeUpdated)) {
      const { notifications } = this.getStore();
      notifications.forEach(notification => {
        if (isNotificationsEqual(notification, notificationToBeUpdated)) {
          // eslint-disable-next-line no-param-reassign
          notification.seen = true;
        }
      });

      this.updateNotifications(notifications);
    }
  }

  public setAllNotificationSeen(): void {
    const { notifications } = this.getStore();
    notifications.forEach(notification => {
      // eslint-disable-next-line no-param-reassign
      notification.seen = true;
    });

    this.updateNotifications(notifications);
  }

  /**
   * Inicia todos listeners/handlers do serviço
   */
  public initListeners(): void {
    this.ThingsChangeHandler();
    this.onSelectedSiteChangeHandler();
  }

  /**
   * Obtém todas notificações do serviço de notificações
   * @param page pagina corrente. Inicial = 0
   * @param pageSize tamanho da página
   */
  public getPanicButtonNotifications(
    page: number,
    pageSize: number,
    notificationStatus?: string
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = ({
        totalCount,
        data: notifications
      }: PaginatedModel<NotificationApiGetModel[]>) => {
        const notificationsMapped = notifications.map(
          ({
            areaName,
            sourceIdentificatorType,
            sourceIdentificator,
            sourceApplicationName,
            sourceApplicationId,
            latitude,
            longitude,
            eventDateTime,
            status,
            attendedByThing,
            attendedEndedByThing,
            attendanceDateTime,
            attendanceEndedDateTime,
            id,
            reason,
            thing,
            comments,
            middleware
          }): PanicAlertNotification => ({
            id,
            areaName,
            type: NotificationType.PanicButton,
            deviceType: sourceIdentificatorType,
            device: sourceIdentificator,
            sourceApplicationName,
            sourceApplicationId,
            location: {
              lat: latitude,
              lng: longitude
            },
            eventDate: new Date(eventDateTime),
            status,
            attendedBy: attendedByThing,
            attendedEndedBy: attendedEndedByThing,
            attendanceDateTime,
            attendanceEndedDateTime,
            reason,
            thing,
            comments: comments
              ? comments.sort(function compare(a, b) {
                  const dateA = new Date(a.dateTime);
                  const dateB = new Date(b.dateTime);
                  return dateB.getTime() - dateA.getTime();
                })
              : [],
            middleware
          })
        );

        this.getPanicButtonNotificationsSubscription.unsubscribe();

        this.updatePanicButtonNotifications(notificationsMapped);
        resolve({ notifications, total: totalCount });
      };

      const onErrorCallback = (e: any) => {
        this.getPanicButtonNotificationsSubscription.unsubscribe();
        this.updatePanicButtonNotifications([]);
        reject(e);
      };

      this.getPanicButtonNotificationsSubscription.unsubscribe();
      const selectedSite = this.sitesService.getSelectedSite();
      this.getPanicButtonNotificationsSubscription = this.notificationRepository
        .getPanicButtonNotifications(
          selectedSite,
          page,
          pageSize,
          notificationStatus
        )
        .subscribe(onSuccessCallback, onErrorCallback);
    });
  }

  /**
   * Obtém as notificações do site em um período de tempo pelo bff, e as retorna. Não é salvo no state
   * @param from data inicial
   * @param till data final
   */
  public getBffNotifications(
    from: string,
    till: string,
    unreadOnly: boolean
  ): Observable<Notification[]> {
    return new Observable(subscriber => {
      const { email } = this.userProfileService.getUserProfile();
      const selectedSite = this.sitesService.getSelectedSite();

      const onSuccessCallback = (notificationModels: NotificationModel[]) => {
        // eslint-disable-next-line no-param-reassign
        if (!notificationModels) notificationModels = [];

        const notifications = notificationModels.map(notification =>
          this.mapNotificationModelToNotification(notification)
        );

        subscriber.next(notifications);
      };

      this.waitUntilUserObjectIsLoaded().then(() => {
        this.getNotificationsByDateSubscription.unsubscribe();
        this.getNotificationsByDateSubscription = this.notificationRepository
          .getNotificationsMadeBy(
            email,
            selectedSite,
            from,
            till,
            unreadOnly,
            NotificationType.PanicButton
          )
          .subscribe(onSuccessCallback, e => subscriber.error(e));
      });
    });
  }

  public updatePanicAlertNotification(
    notificationId: string,
    isAlarmTruthy?: boolean,
    attendanceEndedDateTime?: string,
    newComment?: {
      text: string;
      date: Date;
      author: string;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isAlarmTruthy == null && attendanceEndedDateTime != null) {
        reject(
          new Error(
            'isAlarmTruthy is required to set an attendanceEndedDateTime'
          )
        );
      } else if (isAlarmTruthy == null && newComment != null) {
        reject(new Error('isAlarmTruthy is required to create a newComment'));
      }

      const displayName = this.userProfileService.getUserProfile().userName;

      const attendedEndedBy = displayName ? displayName.substring(0, 100) : '';

      const onSuccessCallback = () => {
        resolve();
      };

      const onErrorCallback = e => {
        reject(e);
      };

      if (isAlarmTruthy == null) {
        this.notificationRepository
          .updatePanicButtonNotification(
            notificationId,
            'InAttendance',
            null,
            null,
            null
          )
          .subscribe(onSuccessCallback, onErrorCallback);
      } else if (isAlarmTruthy) {
        if (attendanceEndedDateTime && !newComment) {
          reject(
            new Error(
              'a new comment is required for saving the attendance with datetime'
            )
          );
        }

        if (newComment) {
          const { text, date, author } = newComment;
          this.notificationRepository
            .createNewPanicButtonNotificationComment(
              notificationId,
              text.substring(0, 500),
              author,
              formatDateAsUTC(date)
            )
            .toPromise();
        }

        this.notificationRepository
          .updatePanicButtonNotification(
            notificationId,
            attendanceEndedDateTime && newComment ? 'Attended' : 'InAttendance',
            'Real',
            attendanceEndedDateTime && attendedEndedBy,
            attendanceEndedDateTime
          )
          .subscribe(onSuccessCallback, onErrorCallback);
      } else {
        if (!newComment)
          reject(new Error('newComment is required to set alarm as false'));

        const { text, date, author } = newComment;
        this.notificationRepository
          .createNewPanicButtonNotificationComment(
            notificationId,
            text.substring(0, 500),
            author,
            formatDateAsUTC(date)
          )
          .toPromise();
        this.notificationRepository
          .updatePanicButtonNotification(
            notificationId,
            'Attended',
            'Falsy',
            attendedEndedBy,
            attendanceEndedDateTime
          )
          .subscribe(onSuccessCallback, onErrorCallback);
      }
    });
  }

  public ThingsChangeHandler(): void {
    this.thingsService.syncThingsByLastLocation({
      site: this.sitesService.getSelectedSite(),
      periodInMinutesToFilter: TWELVE_HOURS_IN_MINUTES,
      isRealTimeSearch: true
    });

    this.thingsService.things$.subscribe(things => {
      const { notifications } = this.getStore();
      const thingsAsNotifications: Notification[] = notifications;
      const thingsWithLowBattery = things.filter(
        thing => thing.batteryState === BatteryState.Low
      );
      thingsWithLowBattery.forEach(thing => {
        const thingAsNotification: Notification = {
          thing: {
            name: thing.name,
            document: thing.document
          },
          eventDate: new Date(thing.eventDateTime),
          description: thing.name,
          batteryPercent: thing.batteryPercent,
          type: NotificationType.LowBattery,
          batteryState: getBatteryState(thing.batteryState),
          device: thing.deviceId,
          deviceType: thing.deviceType,
          location: new Coordinates(thing.latitude, thing.longitude),
          seen: false,
          middleware: thing.middleware
        };

        if (!this.isNotificationAlreadyListed(thingAsNotification)) {
          thingsAsNotifications.push(thingAsNotification);
        }
      });
      this.updateNotifications(thingsAsNotifications);
    });
  }

  private onSelectedSiteChangeHandler(): void {
    this.sitesService.selectedSite$.subscribe(() => {
      this.updateNotifications([]);
    });
  }

  private isNotificationAlreadyListed(
    notificationToBeCompared: Notification
  ): boolean {
    const { notifications } = this.getStore();
    const [notificationFound] = notifications.filter(notificationFiltered =>
      isNotificationsEqual(notificationFiltered, notificationToBeCompared)
    );

    return !!notificationFound;
  }

  private mapNotificationModelToNotification(
    notificationModel: NotificationModel
  ): Notification {
    const {
      id,
      deviceId,
      deviceType,
      description,
      eventDate,
      eventLocation,
      seen,
      notificationType,
      batteryState,
      batteryPercent,
      totalSent,
      sourceApplicationId,
      thing,
      areaName
    } = notificationModel;

    return {
      id,
      type: notificationType,
      eventDate: new Date(eventDate),
      description,
      seen,
      device: deviceId,
      deviceType,
      batteryPercent,
      batteryState: getBatteryState(batteryState),
      location: eventLocation,
      totalSent,
      sourceApplicationId,
      thing,
      areaName
    };
  }

  private waitUntilUserObjectIsLoaded(): Promise<void> {
    const verifyIfUserObjectIsValidOrRetry = resolve => {
      const userProfile = this.userProfileService.getUserProfile();

      if (userProfile.email && userProfile.email.length > 0) resolve();
      else setTimeout(() => verifyIfUserObjectIsValidOrRetry(resolve), 500);
    };

    return new Promise(resolve => {
      verifyIfUserObjectIsValidOrRetry(resolve);
    });
  }

  public async fetchExpiredThings(
    thingsExpirationSearchParams: ThingsExpirationSearchParams
  ): Promise<void> {
    const locationEventsEnrichedThings = await this.locationEventsRepository
      .getThingsbyExpirationTime(thingsExpirationSearchParams)
      .toPromise();

    this.updateExpiredThings(locationEventsEnrichedThings.thingLocationEvents);
  }
}
