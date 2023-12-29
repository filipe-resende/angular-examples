import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import Application from '../../shared/models/application';
import {
  DevicesRepository,
  DeviceWithThing
} from '../../core/repositories/devices.repository';
import { getBatteryState } from '../../shared/enums/batteryState';
import { SitesService } from '../sites/sites.service';
import {
  ClearDeviceFilters,
  ClearDevicesTable,
  ClearDevicesStore,
  UpdateDeviceNumberFilter,
  UpdateDevicesState,
  UpdateDevicesTablePaginator,
  UpdateDevicesTotalCount,
  UpdateHttpErrorResponse,
  UpdateSelectedApplication,
  UpdateDevicesRefreshTimeInfo
} from './devices.actions';
import { DeviceModel, DevicesState, DevicesStateModel } from './devices.state';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import { DeviceLocation } from '../../shared/models/device';
import { ApplicationsIds } from '../../core/constants/applications-ids';
import { SaloboDeviceGroups } from '../../core/constants/salobo-device-groups.enum';

interface FetchDevicesParams {
  from: string;
  till: string;
  deviceType?: string;
  deviceNumber?: string;
  page?: number;
  pageSize?: number;
  isAutoReload?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private devicesSubscription: Subscription = new Subscription();

  private lastFilterParams: any;

  @Select(DevicesState.devices)
  public devices$: Observable<DeviceModel[]>;

  @Select(DevicesState.totalCount)
  public totalCount$: Observable<number>;

  @Select(DevicesState.selectedApplication)
  public selectedApplication$: Observable<Application>;

  @Select(DevicesState.devicesTablePaginator)
  public devicesTablePaginator$: Observable<Paginator>;

  @Select(DevicesState.httpErrorResponse)
  public httpResponseError$: Observable<HttpErrorResponse>;

  @Select(DevicesState.deviceNumber)
  public deviceNumber$: Observable<string>;

  @Select(DevicesState.refreshTimeInfo)
  public refreshTimeInfo$: Observable<Date>;

  autoRefreshTimeout: NodeJS.Timer;

  constructor(
    private store: Store,
    private devicesRepository: DevicesRepository,
    private sitesService: SitesService
  ) {}

  public getStore(): DevicesStateModel {
    return this.store.snapshot().devices as DevicesStateModel;
  }

  /**
   * Atualiza a lista de devices do STATE
   * @param devices devices
   */

  @Dispatch()
  public updateRefreshTimeInfo(
    refreshTimeInfo: Date
  ): UpdateDevicesRefreshTimeInfo {
    return new UpdateDevicesRefreshTimeInfo(refreshTimeInfo);
  }

  @Dispatch()
  public updateDevicesState(devices: DeviceModel[]): UpdateDevicesState {
    return new UpdateDevicesState(devices);
  }

  @Dispatch()
  public updateDevicesTotalCount(totalCount: number): UpdateDevicesTotalCount {
    return new UpdateDevicesTotalCount(totalCount);
  }

  @Dispatch()
  public updateSelectedApplication(
    selectedApplication: Application
  ): UpdateSelectedApplication {
    return new UpdateSelectedApplication(selectedApplication);
  }

  @Dispatch()
  public updateHttpErrorResponse(
    httpErrorResponse: HttpErrorResponse
  ): UpdateHttpErrorResponse {
    return new UpdateHttpErrorResponse(httpErrorResponse);
  }

  @Dispatch()
  public updateDevicesTablePaginator(
    paginator: Paginator
  ): UpdateDevicesTablePaginator {
    return new UpdateDevicesTablePaginator(paginator);
  }

  @Dispatch()
  public updateDeviceNumberFilter(
    deviceNumber: string
  ): UpdateDeviceNumberFilter {
    return new UpdateDeviceNumberFilter(deviceNumber);
  }

  @Dispatch()
  public clearDeviceFilters(): ClearDeviceFilters {
    return new ClearDeviceFilters();
  }

  @Dispatch()
  public clearDevicesTable(): ClearDevicesTable {
    return new ClearDevicesTable();
  }

  /**
   * Limpa todo o STATE
   */
  @Dispatch()
  public clearDevicesStore(): ClearDevicesStore {
    return new ClearDevicesStore();
  }

  public clearRequests(): void {
    this.devicesSubscription.unsubscribe();
  }

  /**
   * Adiciona novos devices no state de devices, desconsiderando repetidos
   */
  public fetchNewDevices(filterParams: FetchDevicesParams): void {
    this.devicesSubscription.unsubscribe();
    clearTimeout(this.autoRefreshTimeout);

    this.lastFilterParams = filterParams;

    const {
      from,
      till,
      deviceNumber,
      deviceType,
      page,
      pageSize,
      isAutoReload
    } = filterParams;

    const { devices: devicesStore } = this.getStore();

    const { name: siteName } = this.sitesService.getSelectedSite();

    this.devicesSubscription = this.devicesRepository
      .getAllDevicesBySite(siteName, deviceType, deviceNumber, page, pageSize)
      .pipe(
        take(1),
        catchError(err => {
          this.updateDevicesState(devicesStore);
          return throwError(err);
        }),
        finalize(() => {
          this.updateRefreshTimeInfo(new Date());
          this.autoRefreshTimeout = this.setNextDevicesReload();
        })
      )
      .subscribe(
        ({ data: deviceWithThingsList, totalCount }) => {
          const newDevices: DeviceModel[] = deviceWithThingsList.map(device =>
            this.mapDeviceWithThingToDeviceModel(device)
          );

          const devicesConcated = [...newDevices, ...devicesStore];

          const devices = isAutoReload
            ? this.getClearDevicesByLastReport(devicesConcated, pageSize)
            : newDevices;

          this.updateDevicesState(devices);

          if (!isAutoReload) {
            this.updateDevicesTotalCount(totalCount);
          }
        },
        error => this.updateHttpErrorResponse(error)
      );
  }

  public updateSelectedApplicationState(application: Application): void {
    this.updateSelectedApplication(application);
  }

  public updatePaginatorState(updatedPaginator: Paginator): void {
    this.updateDevicesTablePaginator(updatedPaginator);
  }

  public clearDevicesReloadTimer(): void {
    clearTimeout(this.autoRefreshTimeout);
  }

  private getClearDevicesByLastReport(
    devices: DeviceModel[],
    pageSize: number
  ) {
    return _.chain(devices)
      .groupBy('deviceId')
      .map(value => _.orderBy(value, 'lastReport', 'desc')[0])
      .orderBy('eventDateTime', 'desc')
      .slice(0, pageSize - 1)
      .value();
  }

  private mapDeviceWithThingToDeviceModel({
    nameThing,
    documentThing,
    eventDateTime,
    deviceType,
    deviceName,
    latitude,
    longitude,
    batteryState,
    batteryPercent,
    applicationId,
    licensePlate,
    eventDirection,
    eventType,
    readerName,
    telemetryName
  }: DeviceWithThing): DeviceModel {
    const lastRepost = new Date(eventDateTime);

    return {
      thingName: nameThing,
      thingDoc: documentThing,
      lastReport:
        Object.prototype.toString.call(lastRepost) === '[object Date]'
          ? lastRepost
          : null,
      lastLocation: {
        lat: latitude,
        lng: longitude
      },
      deviceType,
      deviceId: deviceName,
      batteryState: getBatteryState(batteryState),
      batteryPercent,
      applicationId,
      licensePlate,
      eventDirection,
      eventType,
      readerName,
      telemetryName
    };
  }

  private getTimeFromLastReportedDevice(devices: DeviceModel[]): string {
    const { lastReport } = devices.reduce((previous, current) =>
      current.lastReport > previous.lastReport ? current : previous
    );

    return moment.utc(lastReport).format();
  }

  public enrichDeviceEventsMiddlewareName(
    devices: DeviceLocation[],
    shouldDistinguishSpots: boolean
  ): DeviceLocation[] {
    return devices.map(device => {
      return {
        ...device,
        middleware: this.getDeviceMiddlewareName(device, shouldDistinguishSpots)
      };
    });
  }

  getDeviceMiddlewareName(
    device: DeviceLocation,
    shouldDistinguishSpots: boolean
  ): string {
    if (
      device?.sourceApplicationId?.toLowerCase() === ApplicationsIds.SPOT &&
      shouldDistinguishSpots
    ) {
      return `${device?.deviceType} ${this.getSpotGroupName(
        device.deviceCategoryName
      )}`;
    }
    return device?.deviceType;
  }

  getSpotGroupName(deviceGroupName: string): string {
    if (deviceGroupName === SaloboDeviceGroups.Fixed) return 'SLB I+II';
    if (deviceGroupName === SaloboDeviceGroups.SLBIII) return 'SLB III';
    return 'Temporário';
  }

  private setNextDevicesReload(): NodeJS.Timer {
    const TWO_MINUTES_IN_MILLISECONDS = 60 * 2 * 1000;

    return setTimeout(() => {
      const { devices } = this.getStore();

      const currentTimeUTC = moment.utc();

      const till = currentTimeUTC.format();
      const from = devices.length
        ? this.getTimeFromLastReportedDevice(devices)
        : currentTimeUTC.subtract(1, 'day').format();

      this.fetchNewDevices({
        ...this.lastFilterParams,
        from,
        till,
        isAutoReload: devices.length > 0
      });
    }, TWO_MINUTES_IN_MILLISECONDS);
  }
}
