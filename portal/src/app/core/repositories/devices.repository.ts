import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceLocation } from '../../shared/models/device';

export interface DeviceWithThing extends DeviceLocation {
  nameThing: string;
  documentThing: string;
  applicationId?: string;
}

export interface DeviceWithThingInfosAndTotalCount {
  data: DeviceWithThing[];
  totalCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DevicesRepository {
  public isActiveDeviceGroupFiltering: boolean;

  constructor(private http: HttpClient) {}

  public getAllDevicesBySite(
    site: string,
    deviceType?: string,
    deviceNumber?: string,
    page = 1,
    pageSize = 10
  ): Observable<DeviceWithThingInfosAndTotalCount> {
    let params = new HttpParams()
      .append('site', site)
      .append('page', `${page}`)
      .append('pageSize', `${pageSize}`)
      .append('deviceType', deviceType);

    if (deviceNumber) params = params.append('deviceNumber', deviceNumber);

    const uri = `${environment.locationSuiteBff}/api/v1/device/events`;
    return this.http.get<DeviceWithThingInfosAndTotalCount>(uri, { params });
  }
}
