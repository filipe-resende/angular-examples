import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceStatus } from 'src/app/model/device-status';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeviceStatusRepository {
  constructor(private http: HttpClient) {}

  public getDeviceStatus(): Observable<DeviceStatus[]> {
    return this.http.get<DeviceStatus[]>(
      `${environment.thingsManagementBffUrl}/devicestatus`,
    );
  }
}
