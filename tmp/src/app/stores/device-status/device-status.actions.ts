import { DeviceStatus } from 'src/app/model/device-status';

export class SetDeviceStatusAction {
  public static readonly type = '[DEVICE STATUS] Set';

  constructor(public deviceStatus: DeviceStatus[] = []) {}
}
