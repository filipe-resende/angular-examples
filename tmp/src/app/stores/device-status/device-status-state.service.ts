import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DeviceStatus } from 'src/app/model/device-status';

import { SetDeviceStatusAction } from './device-status.actions';
import {
  DeviceStatusState,
  IDeviceStatusStateModel,
} from './device-status.state';

@Injectable({
  providedIn: 'root',
})
export class DeviceStatusStateService {
  constructor(private store: Store) {}

  @Select(DeviceStatusState.deviceStatus)
  public deviceStatus$: Observable<DeviceStatus[]>;

  @Dispatch()
  public setDeviceStatus = (
    deviceStatus: DeviceStatus[],
  ): SetDeviceStatusAction => new SetDeviceStatusAction(deviceStatus);

  getSnapshot = (): IDeviceStatusStateModel =>
    this.store.snapshot().deviceStatus as IDeviceStatusStateModel;
}
