import { HttpErrorResponse } from '@angular/common/http';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import Application from '../../shared/models/application';
import { DeviceModel } from './devices.state';

export class UpdateDevicesState {
  public static readonly type = '[DEVICES] UpdateDevicesState';

  constructor(public devices: DeviceModel[]) {}
}
export class UpdateDevicesTotalCount {
  public static readonly type = '[DEVICES] UpdateDevicesTotalCount';

  constructor(public totalCount: number) {}
}

export class UpdateSelectedApplication {
  public static readonly type = '[DEVICES] UpdateSelectedApplication';

  constructor(public selectedApplication: Application) {}
}

export class UpdateDevicesTablePaginator {
  public static readonly type = '[DEVICES] UpdatePaginatorState';

  constructor(public devicesTablePaginator: Paginator) {}
}

export class UpdateDeviceNumberFilter {
  public static readonly type = '[DEVICES] UpdateDeviceNumberFilter';

  constructor(public deviceNumber: string) {}
}

export class UpdateDevicesRefreshTimeInfo {
  public static readonly type = '[DEVICES] UpdateDevicesRefreshTimeInfo';

  constructor(public refreshTimeInfo: Date) {}
}

export class ClearDeviceFilters {
  public static readonly type = '[DEVICES] ClearDeviceFilters';
}

export class ClearDevicesTable {
  static readonly type = '[DEVICES] ClearDevicesTable';
}

export class ClearDevicesStore {
  public static readonly type = '[DEVICES] ClearDevicesStore';
}

export class UpdateHttpErrorResponse {
  public static readonly type = '[DEVICES] UpdateHttpErrorResponse';

  constructor(public httpErrorResponse?: HttpErrorResponse) {}
}
