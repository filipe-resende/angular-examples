import { Action, State, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import Application from '../../shared/models/application';
import { BatteryState } from '../../shared/enums/batteryState';
import { Coordinates } from '../../shared/models/coordinates';
import {
  ClearDevicesStore,
  UpdateDevicesState,
  UpdateDevicesTotalCount,
  UpdateDevicesTablePaginator,
  UpdateSelectedApplication,
  UpdateHttpErrorResponse,
  UpdateDeviceNumberFilter,
  ClearDeviceFilters,
  ClearDevicesTable,
  UpdateDevicesRefreshTimeInfo
} from './devices.actions';
import { Paginator } from '../../components/presentational/paginator/paginator.component';

export interface DeviceModel {
  deviceType: string;
  deviceId: string;
  thingName: string;
  thingDoc: string;
  batteryState: BatteryState;
  batteryPercent?: string;
  lastLocation: Coordinates;
  lastReport: Date;
  applicationId?: string;
  licensePlate?: string;
  line?: string;
  eventDirection: string;
  eventType: string;
  typeAccess?: string;
  readerName?: string;
  telemetryName?: string;
}

export interface DeviceDataTableModel {
  devices: DeviceModel[];
  totalCount: number;
}

export class DevicesStateModel {
  public devices: DeviceModel[];

  public totalCount: number;

  public selectedApplication: Application;

  public devicesTablePaginator: Paginator;

  public httpErrorResponse: HttpErrorResponse;

  public deviceNumber: string;

  public refreshTimeInfo: Date;
}

const INITIAL_STATE: DevicesStateModel = {
  devices: [],
  totalCount: 0,
  selectedApplication: {} as Application,
  devicesTablePaginator: { page: 1, perPage: 10, total: 0 },
  httpErrorResponse: null,
  deviceNumber: null,
  refreshTimeInfo: null
};

@State<DevicesStateModel>({
  name: 'devices',
  defaults: INITIAL_STATE
})
export class DevicesState {
  @Selector()
  public static devices(state: DevicesStateModel): DeviceModel[] {
    return state.devices;
  }

  @Selector()
  public static totalCount(state: DevicesStateModel): number {
    return state.totalCount;
  }

  @Selector()
  public static selectedApplication(state: DevicesStateModel): Application {
    return state.selectedApplication;
  }

  @Selector()
  public static devicesTablePaginator(state: DevicesStateModel): Paginator {
    return state.devicesTablePaginator;
  }

  @Selector()
  public static httpErrorResponse(state: DevicesStateModel): HttpErrorResponse {
    return state.httpErrorResponse;
  }

  @Selector()
  public static deviceNumber(state: DevicesStateModel): string {
    return state.deviceNumber;
  }

  @Selector()
  public static refreshTimeInfo(state: DevicesStateModel): Date {
    return state.refreshTimeInfo;
  }

  @Action(UpdateDevicesState)
  public updateDevicesState(
    { patchState }: StateContext<DevicesStateModel>,
    { devices }: UpdateDevicesState
  ): void {
    patchState({ devices: [..._.orderBy(devices, ['lastReport'], ['desc'])] });
  }

  @Action(UpdateDevicesTotalCount)
  public updateDevicesTotalCount(
    { patchState }: StateContext<DevicesStateModel>,
    { totalCount }: UpdateDevicesTotalCount
  ): void {
    patchState({ totalCount });
  }

  @Action(UpdateSelectedApplication)
  public updateSelectedApplication(
    { patchState }: StateContext<DevicesStateModel>,
    { selectedApplication }: UpdateSelectedApplication
  ): void {
    patchState({ selectedApplication });
  }

  @Action(UpdateDevicesTablePaginator)
  public updateDevicesTablePaginator(
    { patchState }: StateContext<DevicesStateModel>,
    { devicesTablePaginator }: UpdateDevicesTablePaginator
  ): void {
    patchState({ devicesTablePaginator });
  }

  @Action(UpdateDeviceNumberFilter)
  public updateDeviceNumberFilter(
    { patchState }: StateContext<DevicesStateModel>,
    { deviceNumber }: UpdateDeviceNumberFilter
  ): void {
    patchState({ deviceNumber });
  }

  @Action(ClearDevicesStore)
  public clearDevicesStore({
    setState
  }: StateContext<DevicesStateModel>): void {
    setState(INITIAL_STATE);
  }

  @Action(ClearDevicesTable)
  public clearDeviceList({
    patchState
  }: StateContext<DevicesStateModel>): void {
    const { devices, totalCount, devicesTablePaginator } = INITIAL_STATE;
    patchState({ devices, totalCount, devicesTablePaginator });
  }

  @Action(ClearDeviceFilters)
  public clearDeviceFilters({
    patchState
  }: StateContext<DevicesStateModel>): void {
    const { deviceNumber, selectedApplication, httpErrorResponse } =
      INITIAL_STATE;

    patchState({
      deviceNumber,
      selectedApplication,
      httpErrorResponse
    });
  }

  @Action(UpdateHttpErrorResponse)
  public updateHttpErrorResponse(
    { patchState }: StateContext<DevicesStateModel>,
    { httpErrorResponse }: UpdateHttpErrorResponse
  ): void {
    patchState({ httpErrorResponse });
  }

  @Action(UpdateDevicesRefreshTimeInfo)
  public updateRefreshTimeInfo(
    { patchState }: StateContext<DevicesStateModel>,
    { refreshTimeInfo }: UpdateDevicesRefreshTimeInfo
  ): void {
    patchState({ refreshTimeInfo });
  }
}
