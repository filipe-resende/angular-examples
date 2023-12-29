import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PanicAlert } from '../../shared/models/panic-alert';
import { Notification } from '../../shared/models/notification';
import {
  UpdatePanicAlerts,
  UpdatePanicAlertWithAccessControlError,
  UpdatePanicState
} from './panic-alert.actions';
import {
  CachePanicAlert,
  PanicAlertState,
  PanicAlertStateModel
} from './panic-alert.state';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationRepository } from '../../core/repositories/notification.repository';
import { environment } from '../../../environments/environment';
import { LocationEventParsed } from '../../shared/models/locationEvent';
import { ThingsManagmentRepository } from '../../core/repositories/thingsManagment.repository';
import { LocationSuiteBffRepository } from '../../core/repositories/locationSuiteBff.repository';
import { CacheService } from '../../core/services/cache-service/cache.service';
import { formatDateAsUTC } from '../../shared/utils/date';
import Application from '../../shared/models/application';
import { LocationSitesRepository } from '../../core/repositories/locationSites.repository';
import { NotificationService } from '../../components/presentational/notification';
import { SourceInfo } from '../../shared/models/sourceInfo';
import { HttpStatusCodeResponse } from '../../shared/interfaces/http-response.interface';
import { UserProfileService } from '../user-profile/user-profile.service';

const THIRTY_MINUTES_IN_MILISECONDS = 30 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class PanicAlertService {
  private syncPanicButtonEventsSubscription: Subscription = new Subscription();

  private signalRHubConnection: signalR.HubConnection;

  @Select(PanicAlertState.alerts)
  public alerts$: Observable<CachePanicAlert[]>;

  @Select(PanicAlertState.isSignalRConnected)
  public isSignalRConnected$: Observable<boolean>;

  @Select(PanicAlertState.accessControlAPIError)
  public accessControlAPIError$: Observable<boolean>;

  constructor(
    private translateService: TranslateService,
    private store: Store,
    private userProfileService: UserProfileService,
    private notificationsService: NotificationsService,
    private locationSitesRepository: LocationSitesRepository,
    private notificationRepository: NotificationRepository,
    private thingsManagmentRepository: ThingsManagmentRepository,
    private locationSuiteBffRepository: LocationSuiteBffRepository,
    private cache: CacheService,
    private notificationService: NotificationService
  ) {}

  public getStore(): PanicAlertStateModel {
    return this.store.snapshot().panicAlert as PanicAlertStateModel;
  }

  @Dispatch()
  public updatePanicAlerts(alerts: CachePanicAlert[]): UpdatePanicAlerts {
    return new UpdatePanicAlerts(alerts);
  }

  @Dispatch()
  public updatePanicState(
    partialPanicAlertState: Partial<PanicAlertStateModel>
  ): UpdatePanicState {
    return new UpdatePanicState(partialPanicAlertState);
  }

  @Dispatch()
  public updatePanicAlertWithAccessControlError(
    accessControlAPIError: boolean
  ): UpdatePanicAlertWithAccessControlError {
    return new UpdatePanicAlertWithAccessControlError(accessControlAPIError);
  }

  /**
   * Inicia todos listeners/handlers do serviço
   */
  public initListeners(): void {
    if (this.userProfileService.getUserRoles().length === 0) {
      setTimeout(() => this.initListeners(), 1000);
    } else if (this.userProfileService.doesUserHavePanicAlertPermission()) {
      this.setupSignalR();
    }
  }

  /**
   * Obtém a quantidade de vezes que o botão foi pressionado antes de abrir o portal
   */
  public getAmountTimesButtonWasPressedWhileOffline(): number {
    const { amountTimesButtonWasPressedWhileOffline } = this.getStore();
    return amountTimesButtonWasPressedWhileOffline;
  }

  /**
   * Confirma para um alerta de pânico que o usuário leu e está ciente. Caso registrado com sucesso a notificação desaparecerá
   * @param alert alerta que aplicará o status de lido
   */
  public setAlertAsAware(alert: CachePanicAlert): Promise<void> {
    return new Promise((resolve, reject) => {
      const {
        userName,
        email
      } = this.userProfileService.getUserProfile();

      const onSuccessCallback = () => {
        this.setAlertAsAwareInCache(alert);

        this.removePanicAlert(alert);

        resolve();
      };

      this.notificationRepository
        .markNotificationAsRead(alert, userName.substring(0, 100), email)
        .subscribe(onSuccessCallback, e => reject(e));
    });
  }

  /**
   * Marca uma notificacao de panico como em atendimento, com isso não é necessário colocar o evento de panico como "aware" (ciente).
   * Caso registrado com sucesso a notificação desaparecerá
   * @param alert alerta que aplicará o status de lido
   */
  public setAlertAsAttended(alert: CachePanicAlert): Promise<void> {
    return new Promise((resolve, reject) => {
      const {
        userName,
        email
      } = this.userProfileService.getUserProfile();

      const onSuccessCallback = () => {
        this.setAlertAsAwareInCache(alert);

        this.removePanicAlert(alert);

        resolve();
      };

      this.notificationRepository
        .markNotificationAsAttended(
          alert,
          userName,
          email,
          formatDateAsUTC(new Date())
        )
        .subscribe(onSuccessCallback, e => reject(e));
    });
  }

  /**
   * Reordena os alertas colocando o alerta desejado em destaque
   * @param alert alerta que será colocado como destaque
   */
  public setAlertAsMainAlert(alert: CachePanicAlert): void {
    const { alerts } = this.getStore();

    const alertToBeFirstIndex = alerts.findIndex(
      element =>
        element.deviceSourceInfoId === alert.deviceSourceInfoId &&
        element.cacheId === alert.cacheId
    );

    alerts.splice(alertToBeFirstIndex, 1);

    const alertsOrdered = _.orderBy(alerts, ['eventDateTime'], ['desc']);

    const itemsToKeepWithoutRerender = alertsOrdered.splice(
      alertToBeFirstIndex,
      alertsOrdered.length
    );
    const itemsToRerender = alertsOrdered.map(alertToRerender => ({
      ...alertToRerender
    }));

    const combineAlertsWithoutAlertToBeFirst = [
      ...itemsToRerender,
      ...itemsToKeepWithoutRerender
    ];

    this.updatePanicAlerts([
      { ...alert },
      ...combineAlertsWithoutAlertToBeFirst
    ]);
  }

  /**
   * Obtém os eventos de botão de pânico perdidos e os carrega no estado
   */
  public syncLostPanicButtonEvents(
    isLoadingApplicationForTheFirstTime: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (notifications: Notification[]) => {
        this.syncPanicButtonEventsSubscription.unsubscribe();

        if (notifications.length === 0) resolve();

        const cachaPanicAlertsResponse: CachePanicAlert[] = notifications
          .filter(n => n.seen === false)
          .map(notification => ({
            id: notification.id,
            eventDateTime: new Date(notification.eventDate),
            eventLocation: notification.location && {
              lat: notification.location.lat,
              lng: notification.location.lng
            },
            deviceSourceInfoId: notification.device,
            counter: notification.totalSent,
            deviceSourceInfoType: notification.deviceType,
            sourceApplicationId: notification.sourceApplicationId,
            cacheId: 1,
            sourceApplicationName: notification.sourceApplicationName,
            thing: {
              name: notification.thing ? notification.thing.name : '',
              document: notification.thing ? notification.thing.document : '',
              iamId: notification.thing ? notification.thing.iamId : '',
              passport: notification.thing ? notification.thing.passport : '',
              company: notification.thing ? notification.thing.company : ''
            },
            areaName: notification.areaName ? notification.areaName : ''
          }));

        const { alerts } = this.getStore();

        cachaPanicAlertsResponse.forEach(panicAlert => {
          if (isLoadingApplicationForTheFirstTime) {
            this.saveAlertInCache(panicAlert);
          } else if (this.tryToSaveAlertInCache(panicAlert)) return;

          let newCachePanicAlert: CachePanicAlert = {
            ...panicAlert,
            cacheId: 1
          };

          newCachePanicAlert =
            this.createNewCachePanicAlertFromPanicAlert(panicAlert);

          newCachePanicAlert.counter = panicAlert.counter;
          alerts.push(newCachePanicAlert);
        });

        const alertsOrdered = _.orderBy(alerts, ['eventDateTime'], ['asc']);

        this.updatePanicAlerts(alertsOrdered);
        this.updatePanicState({
          amountTimesButtonWasPressedWhileOffline: alertsOrdered.length
        });

        resolve();
      };

      const onErrorCallback = e => {
        this.syncPanicButtonEventsSubscription.unsubscribe();
        reject(e);
      };

      const dateOneMonthBack = new Date();
      dateOneMonthBack.setMonth(dateOneMonthBack.getMonth() - 1);

      const startDate: string = dateOneMonthBack.toISOString();
      const endDate: string = new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString();

      if (this.userProfileService.doesUserHavePanicAlertPermission()) {
        this.notificationsService
          .getBffNotifications(startDate, endDate, true)
          .subscribe(onSuccessCallback, onErrorCallback);
      } else {
        resolve();
      }
    });
  }

  private cancelCacheSaveAndUpdateAlertCount(alertInCache: {
    deviceInfo: string;
    userIsAware: boolean;
  }) {
    const { alerts } = this.getStore();
    const alertWithGreaterCacheId =
      this.getAlertWithGreaterCacheIdByBeviceSourceInfoId(
        alertInCache.deviceInfo
      );

    alerts.map(alert => {
      if (
        alert.deviceSourceInfoId ===
          alertWithGreaterCacheId.deviceSourceInfoId &&
        alert.cacheId === alertWithGreaterCacheId.cacheId
      ) {
        return { ...alert, counter: alert.counter + 1 };
      }
      return alert;
    });

    const alertsOrdered = _.orderBy(alerts, ['eventDateTime'], ['asc']);
    this.updatePanicAlerts(alertsOrdered);
  }

  private async checkUsersAccessToSiteByLatLong({
    lat,
    long,
    deviceSourceInfo
  }: {
    lat: number;
    long: number;
    deviceSourceInfo: string;
  }): Promise<boolean> {
    try {
      const access = await this.notificationRepository
        .checkUserAccessByLatLong(lat, long, deviceSourceInfo)
        .toPromise();

      this.updatePanicAlertWithAccessControlError(false);

      return access.response;
    } catch (err) {
      this.updatePanicAlertWithAccessControlError(true);

      const { ACCESS_CONTROL_API_ERROR } = await this.translateService
        .get('PANIC_BUTTON')
        .toPromise();

      this.notificationService.warning(ACCESS_CONTROL_API_ERROR, false, 500000);

      return false;
    }
  }

  private async establishConnectionToSignalRAndSyncEvents(
    isLoadingApplicationForTheFirstTime: boolean
  ) {
    try {
      await this.signalRHubConnection.start();

      this.updatePanicState({ isSignalRConnected: true });
    } catch (err) {
      this.updatePanicState({ isSignalRConnected: false });

      const TWO_MINUTES_IN_MILLISECONDS = 2 * 60 * 1000;

      setTimeout(() => {
        this.establishConnectionToSignalRAndSyncEvents(
          isLoadingApplicationForTheFirstTime
        );
      }, TWO_MINUTES_IN_MILLISECONDS);
    }

    this.syncLostPanicButtonEvents(isLoadingApplicationForTheFirstTime);
  }

  private getDeviceInCacheByKeyValue(alert: PanicAlert) {
    const keys = this.cache.keys();
    const key =
      keys.length &&
      keys.filter(keyValue => keyValue === alert.deviceSourceInfoId);

    return this.cache.get(key);
  }

  private mapLocationEventToPanicAlert({
    thingInfo,
    companyInfo,
    deviceInfo,
    eventDateTime,
    position,
    sourceApplicationId
  }: LocationEventParsed): PanicAlert {
    let passport: SourceInfo;
    let cpf: SourceInfo;
    let iamId: SourceInfo;

    if (thingInfo && _.isArray(thingInfo.sourceInfos)) {
      iamId = thingInfo.sourceInfos.find(
        doc => doc.type.toUpperCase() === 'IAMID'
      );

      cpf = thingInfo.sourceInfos.find(doc => doc.type.toUpperCase() === 'CPF');

      passport = thingInfo.sourceInfos.find(
        doc => doc.type.toUpperCase() === 'PASSPORT'
      );
    }

    const { sourceIdentificator, sourceIdentificatorType } = deviceInfo;
    const [long, lat] = position.geographic.coordinates;

    return {
      id: `${eventDateTime} ${sourceIdentificator}`,
      sourceApplicationId,
      deviceSourceInfoType: sourceIdentificatorType,
      deviceSourceInfoId: sourceIdentificator,
      eventLocation: {
        lat,
        lng: long
      },
      eventDateTime: new Date(eventDateTime),
      thing: {
        name: thingInfo && thingInfo.name ? thingInfo.name : '',
        document: cpf ? cpf.value : '',
        iamId: iamId ? iamId.value : '',
        passport: passport ? passport.value : '',
        company: companyInfo && companyInfo.name ? companyInfo.name : ''
      }
    };
  }

  private onSignalRBroadcastEventsReceivedHandler() {
    this.signalRHubConnection.on('panic-alert', async ({ payload, sender }) => {
      if (sender === 'Panic-Alert-SignalR') {
        const locationEvent: LocationEventParsed = JSON.parse(
          payload
        ) as LocationEventParsed;

        if (locationEvent) {
          const [long, lat] = locationEvent.position.geographic.coordinates;
          const deviceSourceInfo = locationEvent.deviceInfo.sourceIdentificator;
          const hasAccess = await this.checkUsersAccessToSiteByLatLong({
            lat,
            long,
            deviceSourceInfo
          });

          if (hasAccess) {
            const panicAlert: PanicAlert =
              this.mapLocationEventToPanicAlert(locationEvent);

            if (this.tryToSaveAlertInCache(panicAlert)) return;

            const { alerts } = this.getStore();
            let newCachePanicAlert: CachePanicAlert = {
              ...panicAlert,
              cacheId: 1
            };

            newCachePanicAlert =
              this.createNewCachePanicAlertFromPanicAlert(panicAlert);

            this.updateAssociatedThingFromPanicAlertGivenLocationEventAsync(
              locationEvent
            );

            newCachePanicAlert.counter = 1;
            alerts.push(newCachePanicAlert);

            const alertsOrdered = _.orderBy(alerts, ['eventDateTime'], ['asc']);
            this.updatePanicAlerts(alertsOrdered);
          }
        }
      }
    });
  }

  private setAlertAsAwareInCache(alert: PanicAlert) {
    const newValueToStoreCache = { userIsAware: true };
    this.cache.updateCache(alert.deviceSourceInfoId, newValueToStoreCache);
  }

  private tryToSaveAlertInCache(alert: PanicAlert) {
    const valueInCache: {
      deviceInfo: string;
      userIsAware: boolean;
    } = this.getDeviceInCacheByKeyValue(alert);

    if (valueInCache) {
      if (!valueInCache.userIsAware) {
        this.cancelCacheSaveAndUpdateAlertCount(valueInCache);
      }

      return true;
    }

    const valueToStoreInCache = {
      deviceInfo: alert.deviceSourceInfoId,
      userIsAware: false
    };

    this.cache.put(
      alert.deviceSourceInfoId,
      valueToStoreInCache,
      THIRTY_MINUTES_IN_MILISECONDS
    );

    return false;
  }

  private saveAlertInCache(alert: PanicAlert) {
    const valueToStoreInCache = {
      deviceInfo: alert.deviceSourceInfoId,
      userIsAware: false
    };

    this.cache.put(
      alert.deviceSourceInfoId,
      valueToStoreInCache,
      THIRTY_MINUTES_IN_MILISECONDS
    );
  }

  private async setupSignalR() {
    // configuração da conexão
    this.signalRHubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.locationPanicEventSignalR)
      .build();

    // conecta com signalR
    this.establishConnectionToSignalRAndSyncEvents(true);

    // sem rede, tenta reconectar
    this.signalRHubConnection.onclose(() => {
      this.establishConnectionToSignalRAndSyncEvents(false);
    });

    this.onSignalRBroadcastEventsReceivedHandler();
  }

  private async updateAssociatedThingFromPanicAlertGivenLocationEventAsync(
    locationEvent: LocationEventParsed
  ) {
    if (locationEvent) {
      const { alerts } = this.getStore();
      const { sourceApplicationId, deviceInfo } = locationEvent;
      const [long, lat] = locationEvent.position.geographic.coordinates;

      const site = await this.locationSitesRepository
        .getSiteByName(long, lat)
        .pipe(
          map(siteArr => siteArr),
          catchError(() => of([{ name: '', description: '' }]))
        )
        .toPromise();

      const application = await this.thingsManagmentRepository
        .getApplicationById(sourceApplicationId)
        .pipe(
          map(applicationObject => applicationObject),
          catchError(() => of({ id: '', name: '' } as Application))
        )
        .toPromise();

      const alertIndex = alerts.findIndex(
        alert =>
          alert.eventDateTime.getTime() ===
            new Date(locationEvent.eventDateTime).getTime() &&
          alert.deviceSourceInfoId === deviceInfo.sourceIdentificator
      );

      if (!locationEvent.thingInfo) {
        this.getThingInfosAndUpdatePanicAlertInfo(
          locationEvent,
          application,
          alerts,
          site
        );
      } else {
        alerts[alertIndex].sourceApplicationName =
          application && application.name;
        alerts[alertIndex].areaName =
          site && _.isArray(site) ? site[0].name : '';

        const alertsOrdered = _.orderBy(alerts, ['eventDateTime'], ['asc']);
        this.updatePanicAlerts(alertsOrdered);
      }
    }
  }

  private async getThingInfosAndUpdatePanicAlertInfo(
    locationEvent: LocationEventParsed,
    application: Application,
    alerts: CachePanicAlert[],
    site: Array<{ name: string; description: string }>
  ) {
    const { sourceApplicationId, deviceInfo } = locationEvent;
    const { sourceIdentificatorType, sourceIdentificator } = deviceInfo;

    const device = await this.locationSuiteBffRepository
      .getDeviceByApplicationIdAndSourceInfoValue(
        sourceApplicationId,
        sourceIdentificator
      )
      .toPromise();

    if (
      device != null &&
      device.associatedThings != null &&
      device.associatedThings.length > 0
    ) {
      const thingAssociated = _.orderBy(
        device.associatedThings.map(associatedThing => ({
          ...associatedThing,
          associationDate: new Date(associatedThing.associationDate)
        })),
        ['associationDate'],
        ['desc']
      )[0];

      if (thingAssociated.thing) {
        const {
          thing: { name, companyInfo, sourceInfos }
        } = thingAssociated;

        const iamId = sourceInfos.find(
          doc => doc.type.toUpperCase() === 'IAMID'
        );
        const cpf = sourceInfos.find(doc => doc.type.toUpperCase() === 'CPF');

        const passport = sourceInfos.find(
          doc => doc.type.toUpperCase() === 'PASSPORT'
        );

        const alertsMapped = _.chain(alerts)
          .map(alert => {
            const alertDateTime = alert.eventDateTime.getTime();

            const locationDateTime = new Date(
              locationEvent.eventDateTime
            ).getTime();

            if (
              alertDateTime === locationDateTime &&
              alert.deviceSourceInfoId === deviceInfo.sourceIdentificator
            ) {
              return {
                ...alert,
                thing: {
                  name,
                  companyInfo: companyInfo ? companyInfo.companyName : '',
                  passport: passport ? passport.value : '',
                  iamId: iamId ? iamId.value : '',
                  document: cpf ? cpf.value : ''
                },
                sourceApplicationName: application.name,
                areaName: site && _.isArray(site) ? site[0].name : ''
              };
            }

            return {
              ...alert,
              areaName:
                // eslint-disable-next-line no-nested-ternary
                !alert.areaName && site && _.isArray(site)
                  ? site[0].name
                  : alert.areaName
                  ? alert.areaName
                  : ''
            };
          })
          .orderBy('eventDateTime', 'asc')
          .value();

        this.updatePanicAlerts(alertsMapped);

        return alertsMapped;
      }
    }

    const alertsMapped = _.chain(alerts)
      .map(alert => {
        return {
          ...alert,
          areaName:
            // eslint-disable-next-line no-nested-ternary
            !alert.areaName && site && _.isArray(site)
              ? site[0].name
              : alert.areaName
              ? alert.areaName
              : ''
        };
      })
      .orderBy('eventDateTime', 'asc')
      .value();

    this.updatePanicAlerts(alertsMapped);

    return alertsMapped;
  }

  private isAlertAlreadyInState(panicAlert: PanicAlert): boolean {
    const { alerts } = this.getStore();

    const alertsAlreadyInState = alerts.filter(
      alert => alert.deviceSourceInfoId === panicAlert.deviceSourceInfoId
    );
    return alertsAlreadyInState.length > 0;
  }

  private createNewCachePanicAlertFromPanicAlert(
    panicAlert: PanicAlert
  ): CachePanicAlert {
    let newCacheId = 1;

    if (this.isAlertAlreadyInState(panicAlert)) {
      const alertWithGreaterCacheId =
        this.getAlertWithGreaterCacheIdByBeviceSourceInfoId(
          panicAlert.deviceSourceInfoId
        );
      newCacheId = alertWithGreaterCacheId.cacheId + 1;
    }

    const cachePanicAlert: CachePanicAlert = {
      ...panicAlert,
      cacheId: newCacheId
    };

    return cachePanicAlert;
  }

  private getAlertWithGreaterCacheIdByBeviceSourceInfoId(
    deviceSourceInfoId: string
  ): CachePanicAlert {
    const { alerts } = this.getStore();

    const alertsAlreadyInState = alerts.filter(
      alert => alert.deviceSourceInfoId === deviceSourceInfoId
    );
    const alertsAlreadyInStateOrdered = _.orderBy(
      alertsAlreadyInState,
      ['cacheId'],
      ['desc']
    );
    return alertsAlreadyInStateOrdered.length > 0
      ? alertsAlreadyInStateOrdered[0]
      : null;
  }

  private removePanicAlert(alert: CachePanicAlert) {
    const { alerts } = this.getStore();

    const alertToBeFirstIndex = alerts.findIndex(
      element =>
        element.deviceSourceInfoId === alert.deviceSourceInfoId &&
        element.cacheId === alert.cacheId
    );
    alerts.splice(alertToBeFirstIndex, 1);

    this.updatePanicAlerts(alerts);
  }

  public setAllPanicEventsAsNotApplicable(): Observable<HttpStatusCodeResponse> {
    const {
      email
    } = this.userProfileService.getUserProfile();
    return this.notificationRepository.setAllPanicEventsAsNotApplicable(email);
  }
}
