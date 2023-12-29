import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DeviceStatusRepository } from 'src/app/core/repositories/device-status.repository';
import { DeviceStatusStateService } from 'src/app/stores/device-status/device-status-state.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceStatusService {
  constructor(
    private deviceStatusRepository: DeviceStatusRepository,
    private deviceStatusStateService: DeviceStatusStateService,
  ) {}

  public setStateDeviceStatus(): void {
    this.deviceStatusRepository
      .getDeviceStatus()
      .toPromise()
      .then(result => {
        if (result.length)
          this.deviceStatusStateService.setDeviceStatus(result);
      });
  }
}
