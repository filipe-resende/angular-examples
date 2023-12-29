import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StoreOptions } from '@ngxs/store/src/symbols';
import { DeviceStatus } from 'src/app/model/device-status';
import { SetDeviceStatusAction } from './device-status.actions';

export interface IDeviceStatusStateModel {
  deviceStatus: DeviceStatus[];
}

const INITIAL_STATE = {
  deviceStatus: [],
};

type DeviceStatusStateContext = StateContext<IDeviceStatusStateModel>;

@Injectable({ providedIn: 'root' })
@State<IDeviceStatusStateModel>({
  name: 'deviceStatus',
  defaults: INITIAL_STATE,
} as StoreOptions<IDeviceStatusStateModel>)
export class DeviceStatusState {
  @Selector()
  public static deviceStatus(state: IDeviceStatusStateModel): DeviceStatus[] {
    return state.deviceStatus;
  }

  @Action(SetDeviceStatusAction)
  public setDeviceStatus(
    { patchState }: DeviceStatusStateContext,
    { deviceStatus }: SetDeviceStatusAction,
  ) {
    patchState({ deviceStatus });
  }
}
