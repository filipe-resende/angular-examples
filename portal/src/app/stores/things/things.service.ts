/* eslint consistent-return: "warn" */

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { filter, finalize, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../components/presentational/notification';
import {
  LocationEventsRepository,
  LocationRepositoryDocumentType
} from '../../core/repositories/location-events.repository';
import {
  LocationRepository,
  ThingDevicesLocation
} from '../../core/repositories/location.repository';
import { Geofence } from '../../shared/models/geofence';
import { LocationEventsEnrichedThings } from '../../shared/models/locationEventsEnrichedThings';
import { PaginatedModel } from '../../shared/models/paginatedModel';
import { Site } from '../../shared/models/site';
import { ExtendedThing, Thing } from '../../shared/models/thing';
import { ThingByName } from '../../shared/models/thingByName';
import { normalizeText } from '../../shared/utils/string';
import { HeaderService } from '../header/header.service';
import {
  ClearFilterdThingsList,
  ClearThingsStore,
  FetchThingsByName,
  UpdateHttpErrorResponse,
  UpdateRefreshTimeInfo,
  UpdateRefreshTimeInfoHistoricPage,
  UpdateThingsState,
  UpdateThingTracking
} from './things.actions';
import { ThingsState, ThingsStateModel, ThingTrackModel } from './things.state';
import { ModalStatusComponent } from '../../components/presentational/modal-status/modal-status.component';
import { UserNotIncludedInDeviceGroup } from '../../core/constants/error';
import { ApplicationsIds } from '../../core/constants/applications-ids';
import { SaloboDeviceGroups } from '../../core/constants/salobo-device-groups.enum';
import { TWELVE_HOURS_IN_MINUTES } from '../../shared/constants';
import { getTypeAccess } from '../../shared/utils/location-events-helpers/location-events-helpers';
import { Middlewares } from '../../core/constants/middleware.const';
import { TypeLocationCount } from '../../shared/models/dashboard/TypeLocationCount';
import { ArrayHelper } from '../../shared/utils/array-helper/array-helper';

export interface ThingDocumentFilter {
  thingDocument: string;
  thingDocumentType: LocationRepositoryDocumentType;
}

interface ExportSearchParamsObj {
  siteName: string;
  email: string;
  perimeters: Geofence[];
  periodInMinutes?: number;
  deviceType?: string;
}

interface ExportPathParamsObj {
  email: string;
  thingId: string;
  type: string;
  inicialDate: string;
  finalDate: string;
  selectedSite: string;
}
@Injectable({
  providedIn: 'root'
})
export class ThingsService {
  private thingsSubscription: Subscription = new Subscription();

  private thingsToDisplayAtMapSubscription: Subscription = new Subscription();

  private thingsCountSubscription: Subscription = new Subscription();

  private typeLocationCountSubscription: Subscription = new Subscription();

  private thingTrackingSubscription: Subscription = new Subscription();

  @Select(ThingsState.things)
  public things$: Observable<Thing[]>;

  @Select(ThingsState.thingsToDisplayAtMap)
  public thingsToDisplayAtMap$: Observable<Thing[]>;

  @Select(ThingsState.thingsAsPaginatedList)
  public thingsAsPaginatedList$: Observable<PaginatedModel<Thing[]>>;

  @Select(ThingsState.thingsCount)
  public thingsCount$: Observable<number>;

  @Select(ThingsState.typeLocationCount)
  public typeLocationCount$: Observable<TypeLocationCount>;

  @Select(ThingsState.thingTracking)
  public thingTracking$: Observable<ThingTrackModel>;

  @Select(ThingsState.httpErrorResponse)
  public httpResponseError$: Observable<HttpErrorResponse>;

  @Select(ThingsState.refreshTimeInfo)
  public refreshTimeInfo$: Observable<Date>;

  @Select(ThingsState.refreshTimeInfoHistoricPage)
  public refreshTimeInfoHistoricPage$: Observable<Date>;

  @Select(ThingsState.thingsFilteredByNameList)
  public thingsFilteredByNameList$: Observable<ThingByName[]>;

  @Select(ThingsState.isFetchingThings)
  public isFetchingThings$: Observable<boolean>;

  constructor(
    private translateService: TranslateService,
    private store: Store,
    private locationRepository: LocationRepository,
    private notification: NotificationService,
    private headerService: HeaderService,
    private locationEventsRepository: LocationEventsRepository,
    private dialog: MatDialog
  ) {}

  public getStore(): ThingsStateModel {
    return this.store.snapshot().things as ThingsStateModel;
  }

  @Dispatch()
  public updateThingsState(
    thingsStateModel: Partial<ThingsStateModel>
  ): UpdateThingsState {
    return new UpdateThingsState(thingsStateModel);
  }

  @Dispatch()
  private updateThingTrackingState(
    thingsStateModel: ThingTrackModel
  ): UpdateThingTracking {
    return new UpdateThingTracking(thingsStateModel);
  }

  @Dispatch()
  public resetSubscriptionsAndStore(): ClearThingsStore {
    this.thingsSubscription.unsubscribe();
    this.thingTrackingSubscription.unsubscribe();
    this.thingsCountSubscription.unsubscribe();
    this.typeLocationCountSubscription.unsubscribe();

    return new ClearThingsStore();
  }

  @Dispatch()
  public clearStore(): ClearThingsStore {
    return new ClearThingsStore();
  }

  @Dispatch()
  public updateRefreshTimeInfo(refreshTimeInfo: Date): UpdateRefreshTimeInfo {
    return new UpdateRefreshTimeInfo(refreshTimeInfo);
  }

  @Dispatch()
  public updateRefreshTimeInfoHistoricPage(
    refreshTimeInfoHistoricPage: Date
  ): UpdateRefreshTimeInfoHistoricPage {
    return new UpdateRefreshTimeInfoHistoricPage(refreshTimeInfoHistoricPage);
  }

  @Dispatch()
  public fetchThingsByName(name: string): FetchThingsByName {
    return new FetchThingsByName(name);
  }

  @Dispatch()
  public clearFilterdThingsList(): ClearFilterdThingsList {
    return new ClearFilterdThingsList();
  }

  @Dispatch()
  public updateHttpErrorResponse(
    httpErrorResponse: HttpErrorResponse
  ): UpdateHttpErrorResponse {
    return new UpdateHttpErrorResponse(httpErrorResponse);
  }

  /**
   * Limpa os arrays de listagem de pessoas somente
   */
  public clearThings(): void {
    const {
      thingsAsPaginatedList: { perPage }
    } = this.getStore();

    this.updateThingsState({
      things: [],
      thingsCount: 0,
      typeLocationCount: {
        bus: 0,
        facialRecognition: 0,
        SmartBadge: 0,
        Spot: 0,
        securityCenter: 0,
        portable: 0,
        hasValue: false
      },
      thingsAsPaginatedList: {
        data: [],
        totalCount: 0,
        perPage,
        page: 1
      },
      thingsToDisplayAtMap: []
    });
  }

  public updateThings(things: Thing[]): void {
    this.updateThingsState({ things });
  }

  public updateThingsTracking(thingTracking: ThingTrackModel): void {
    this.updateThingsState({ thingTracking });
  }

  /**
   * Retornar as things do state
   */
  public getThings(): Thing[] {
    return this.getStore().things;
  }

  /**
   * Atualiza as things do STATE com a última LOCALIZAÇÃO LAT LONG das things de um determinado site
   *
   * @param site Filtra as things por site
   * @param periodInMinutes Obtém as things dentro dos últimos "periodInMinutes" minutos
   * @param deviceType Filtra as things por um deviceType/application, ex: SPOT, Maxtrack
   */
  public async syncThingsByLastLocation({
    site,
    deviceType,
    periodInMinutesToFilter,
    isRealTimeSearch
  }: {
    site: Site;
    periodInMinutesToFilter?: number;
    deviceType?: string;
    isRealTimeSearch?: boolean;
  }): Promise<void> {
    if (!site?.name) return;

    return new Promise((resolve, reject) => {
      const onSuccessCallback = (
        thingsResponse: LocationEventsEnrichedThings
      ) => {
        const {
          thingsAsPaginatedList: { page, perPage },
          things: oldThings,
          thingsCount: totalCount
        } = this.getStore();

        const concatenatedThings = oldThings.concat(
          thingsResponse.thingLocationEvents || []
        );

        const thingsFiltered = _.chain(concatenatedThings)
          .groupBy('id')
          .map(value => _.orderBy(value, 'eventDateTime', 'desc')[0])
          .filter(
            value => moment().diff(moment(value.eventDateTime), 'hours') <= 12
          )
          .orderBy('eventDateTime', 'desc')
          .value();

        const searchbarText = this.headerService.getSearchbarText();

        this.updateThingsState({
          things: thingsFiltered,
          thingsCount: thingsFiltered.length,
          typeLocationCount: this.countTypeLocation(thingsFiltered),
          isFetchingThings: false
        });

        if (searchbarText) {
          this.filterThings(searchbarText);
        } else {
          this.updateThingsState({
            thingsAsPaginatedList: {
              data: thingsFiltered.slice(
                (page - 1) * perPage,
                (page - 1) * perPage + perPage
              ),
              totalCount,
              page,
              perPage
            }
          });
        }

        this.thingsSubscription.unsubscribe();
        resolve();
      };

      this.thingsSubscription.unsubscribe();

      this.updateThingsState({ isFetchingThings: true });
      let periodInMinutes: number;

      if (isRealTimeSearch) {
        periodInMinutes = TWELVE_HOURS_IN_MINUTES;
        this.clearThings();
      } else {
        const { things } = this.getStore();
        periodInMinutes =
          periodInMinutesToFilter ||
          this.getTimeBetweenNowAndLastThingEvent(things);
      }

      this.thingsSubscription = this.locationEventsRepository
        .listThingsLastLocationsByGeofences({
          siteName: site.name,
          minutes: periodInMinutes,
          deviceType,
          isRealTimeSearch
        })
        .pipe(
          take(1),
          finalize(() => {
            this.updateRefreshTimeInfo(new Date());
          })
        )
        .subscribe(onSuccessCallback, error => {
          this.onThingsSyncErrorCallback(error, reject);
          this.updateThingsState({ isFetchingThings: false });
        });
    });
  }

  /**
   * Atualiza a thingTrack do STATE com com os dados da thing e uma lista de localizações dos devices da thing.
   * Um dos dois parâmetros deve ser informado (thingId ou thingDocument):
   * @param thingId Pode atualizar os dados pelo Id da thing
   * @param thingDocument Pode atualizar os dados pelo documento da thing
   * @param from Data de filtro: a partir de
   * @param till Data de filtro: até
   */
  public async syncThingTracking(
    thingId?: string,
    thingDocument?: ThingDocumentFilter,
    from?: string,
    till?: string,
    intervalInMinutes?: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((thingId != null && thingId) || thingDocument) {
        const onErrorCallback = error => {
          this.updateThingsState({ thingTracking: null });
          this.thingTrackingSubscription.unsubscribe();
          reject(error);
        };

        if (thingId != null && thingId) {
          this.updateThingTrackingByThingId(
            resolve,
            onErrorCallback,
            thingId,
            from,
            till,
            intervalInMinutes
          );
        } else {
          this.updateThingTrackingByDocument(
            resolve,
            onErrorCallback,
            thingDocument,
            from,
            till
          );
        }
      } else {
        reject(
          new Error(
            'thingId or thingDocument must be informed in order to sync the thing tracking'
          )
        );
      }
    });
  }

  public changeThingsAsPaginatedListPage(newPage: number): void {
    const {
      thingsAsPaginatedList: { perPage },
      things
    } = this.getStore();

    const { text: textSearchbar } = this.store.snapshot().header.searchbar;

    const filteredThings = _.filter(things, thing =>
      thing.name.includes((textSearchbar || '').toUpperCase())
    );

    this.updateThingsState({
      thingsAsPaginatedList: {
        data: filteredThings.slice(
          (newPage - 1) * perPage,
          (newPage - 1) * perPage + perPage
        ),
        page: newPage,
        totalCount: filteredThings.length,
        perPage
      }
    });
  }

  public filterThings(text: string): void {
    const {
      thingsAsPaginatedList: { perPage },
      things
    } = this.getStore();

    const cleanText = normalizeText(text);

    const filteredThings = things.filter(({ name, deviceId, document }) => {
      return (
        normalizeText(name).includes(cleanText) ||
        deviceId.includes(cleanText) ||
        document?.includes(cleanText)
      );
    });

    this.updateThingsState({
      thingsAsPaginatedList: {
        data: filteredThings.slice(0, perPage),
        page: 1,
        totalCount: filteredThings.length,
        perPage
      }
    });
  }

  private getTimeBetweenNowAndLastThingEvent(things: Thing[]): number {
    const { eventDateTime: lastDateTime } = things.reduce((previous, current) =>
      current.eventDateTime > previous.eventDateTime ? current : previous
    );

    return moment().diff(moment(lastDateTime), 'minutes');
  }

  private onThingsSyncErrorCallback(error, reject: (_error) => void) {
    const {
      thingsAsPaginatedList: { perPage, data, totalCount, page },
      things
    } = this.getStore();

    this.updateHttpErrorResponse(error);

    this.updateThingsState({
      things: [...things],
      thingsAsPaginatedList: {
        data: [...data],
        totalCount,
        page,
        perPage
      }
    });

    this.setupResponseErrorSub();
    this.thingsSubscription.unsubscribe();
    reject(error);
  }

  setupResponseErrorSub(): void {
    this.httpResponseError$.pipe(filter(x => !!x)).subscribe(error => {
      this.openStatusModal(error);
    });

    this.updateHttpErrorResponse(null);
  }

  openStatusModal(httpErrorResponse: HttpErrorResponse): void {
    if (
      httpErrorResponse?.status === 400 &&
      (httpErrorResponse?.error ?? []).includes(UserNotIncludedInDeviceGroup)
    ) {
      this.dialog.closeAll();
      this.translateService
        .get(`DEVICES.HTTP_ERROR_RESPONSES.DEVICE_GROUP_NOT_FOUND`)
        .subscribe(response => {
          const content: string = response;
          this.dialog.open(ModalStatusComponent, {
            data: {
              content
            }
          });
        });
    }
  }

  private onUpdateThingTrackingSuccessCallback(
    { id, name, document, devicesLocation }: ThingDevicesLocation,
    from: string,
    till: string,
    intervalInMinutes: number,
    resolve: () => void
  ) {
    if (devicesLocation.length === 0) {
      this.notification.warning(
        'A pessoa informada não reportou posições no período especificado'
      );
    }

    this.updateThingTrackingState({
      thingId: id,
      name,
      document,
      devicesLocation,
      lastDeviceLocation: _.last(devicesLocation),
      filteredFrom: from,
      filteredTill: till,
      filteredInterval: intervalInMinutes
    });

    this.thingTrackingSubscription.unsubscribe();
    resolve();
  }

  getTextDeviceGroupNotFound(): string {
    let textDeviceGroupNotFound: string;
    this.translateService
      .get(`DEVICES.HTTP_ERROR_RESPONSES.DEVICE_GROUP_NOT_FOUND`)
      .subscribe(textResponse => {
        textDeviceGroupNotFound = textResponse;
      });
    return textDeviceGroupNotFound;
  }

  private updateThingTrackingByThingId(
    resolve: () => void,
    onErrorCallback: (value: any) => void,
    thingId: string,
    from?: string,
    till?: string,
    intervalInMinutes?: number
  ): void {
    this.thingTrackingSubscription.unsubscribe();
    this.thingTrackingSubscription = this.locationRepository
      .getMultipleDevicesLocationByThing(thingId, from, till, intervalInMinutes)
      .subscribe(
        result =>
          this.onUpdateThingTrackingSuccessCallback(
            result,
            from,
            till,
            intervalInMinutes,
            resolve
          ),
        onErrorCallback
      );
  }

  private updateThingTrackingByDocument(
    resolve: () => void,
    onErrorCallback: (value: any) => void,
    { thingDocumentType, thingDocument }: ThingDocumentFilter,
    from?: string,
    till?: string
  ): void {
    this.thingTrackingSubscription.unsubscribe();

    this.thingTrackingSubscription = this.locationEventsRepository
      .getDevicesLocations(thingDocumentType, thingDocument, from, till)
      .subscribe(
        result =>
          this.onUpdateThingTrackingSuccessCallback(
            result,
            from,
            till,
            0,
            resolve
          ),
        onErrorCallback
      );
  }

  public updateThingFilteredListByName(name: string): void {
    this.fetchThingsByName(name);
  }

  public updateRefreshTimeInfoHistoricPageState(): void {
    this.updateThingsState({
      refreshTimeInfoHistoricPage: new Date()
    });
  }

  public async syncThingsLatestEventsToDisplayOnMapByGeofences(
    siteName: string,
    perimeters: Geofence[],
    periodInMinutes?: number,
    deviceType?: string,
    isRealTimeSearch?: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (
        thingsResponse: LocationEventsEnrichedThings
      ) => {
        const things = _.isArray(thingsResponse.thingLocationEvents)
          ? thingsResponse.thingLocationEvents
          : [];

        const { thingsToDisplayAtMap } = this.getStore();

        const concatenatedThings = thingsToDisplayAtMap.concat(things);

        const newThingsToDisplayAtMap = _.chain(concatenatedThings)
          .groupBy('id')
          .map(value => _.orderBy(value, 'eventDateTime', 'desc')[0])
          .filter(
            value =>
              moment().diff(moment(value.eventDateTime), 'minutes') <=
              periodInMinutes
          )
          .orderBy('eventDateTime', 'desc')
          .value();

        this.updateThingsState({
          thingsToDisplayAtMap: newThingsToDisplayAtMap,
          latestEventDate: thingsResponse.latestEventDate
        });

        this.thingsToDisplayAtMapSubscription.unsubscribe();
        resolve();
      };

      this.thingsToDisplayAtMapSubscription.unsubscribe();

      const { latestEventDate } = this.getStore();
      let periodToSearch = null;

      if (latestEventDate) {
        periodToSearch = null;
      } else {
        periodToSearch = periodInMinutes;
      }

      this.thingsToDisplayAtMapSubscription = this.locationEventsRepository
        .listThingsLastLocationsByGeofences({
          siteName,
          minutes: periodToSearch,
          initialDate: latestEventDate,
          geofences: perimeters,
          deviceType,
          isRealTimeSearch
        })
        .subscribe(onSuccessCallback, error =>
          this.onThingsSyncErrorCallback(error, reject)
        );
    });
  }

  getMiddlewareName(
    thing: ExtendedThing,
    shouldDistinguishSpots: boolean
  ): string {
    if (
      thing?.applicationId?.toLowerCase() === ApplicationsIds.SPOT &&
      shouldDistinguishSpots
    ) {
      return `${Middlewares.Spot} ${this.getSpotGroupName(
        thing.deviceCategoryName
      )}`;
    }
    return thing?.middleware;
  }

  public enrichEventsMiddlewareNameAndTypeAccess(
    things: ExtendedThing[],
    shouldDistinguishSpots: boolean
  ): ExtendedThing[] {
    return things.map(thing => {
      return {
        ...thing,
        middleware: this.getMiddlewareName(thing, shouldDistinguishSpots),
        typeAccess: getTypeAccess(thing)
      };
    });
  }

  getSpotGroupName(deviceGroupName: string): string {
    if (deviceGroupName === SaloboDeviceGroups.Fixed) return 'SLB I+II';
    if (deviceGroupName === SaloboDeviceGroups.SLBIII) return 'SLB III';
    return 'Temporário';
  }

  public exportThingsLatestEvents(
    paramsObj: ExportSearchParamsObj
  ): Promise<void> {
    return this.locationEventsRepository
      .exportListThingsLastLocations({
        ...paramsObj
      })
      .toPromise();
  }

  public exportPathFromThing(paramsObj: ExportPathParamsObj): Promise<void> {
    return this.locationEventsRepository
      .exportPathFromThing({ ...paramsObj })
      .toPromise();
  }

  public countTypeLocation(things: Thing[]): TypeLocationCount {
    const countByMiddleware = ArrayHelper.groupByProperty(things, 'middleware');
    const result: TypeLocationCount = {
      bus: countByMiddleware[Middlewares.Bus]?.length ?? 0,
      facialRecognition:
        countByMiddleware[Middlewares.FacialRecognitionAdapter]?.length ?? 0,
      SmartBadge: countByMiddleware[Middlewares.SmartBadge]?.length ?? 0,
      Spot: countByMiddleware[Middlewares.Spot]?.length ?? 0,
      securityCenter:
        countByMiddleware[Middlewares.SecurityCenter]?.length ?? 0,
      portable:
        (countByMiddleware[Middlewares.PortableBadgeReaderIot]?.length ?? 0) +
        (countByMiddleware[Middlewares.PortableBadgeReaderAlutel]?.length ?? 0),
      hasValue: false
    };
    result.hasValue = Object.values(result).some(
      valor => typeof valor === 'number' && valor !== 0
    );
    return result;
  }
}
