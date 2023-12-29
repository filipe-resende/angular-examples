/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, take } from 'rxjs/operators';
import { ImportDevices } from 'src/app/model/import-devices-interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MovementHistoryListResponse } from 'src/app/shared/interfaces/movement-history-list-response.interface';
import {
  DeviceAssociation,
  DeviceItem,
  Devices,
} from '../../model/devices-interfaces';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private readonly BASE_URL = environment.thingsManagementApiUrl;

  private readonly BFF_URL = `${environment.thingsManagementBffUrl}`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private service: HttpClient) {}

  getAll(
    applicationId: string,
    skip = 0,
    page = 0,
    sourceInfoValue = '',
    associated = null,
  ) {
    return this.service
      .get<Devices>(
        `${
          this.BFF_URL
        }/applications/${applicationId}/devices?skip=${skip}&count=${page}${
          sourceInfoValue ? `&sourceInfoValue=${sourceInfoValue}` : ''
        }${associated ? `&associated=${associated}` : ''}`,
      )
      .pipe(take(1), share());
  }

  getDeviceById(applicationId: string, deviceId: string) {
    return this.service
      .get<DeviceAssociation>(
        `${this.BFF_URL}/applications/${applicationId}/devices/${deviceId}`,
      )
      .pipe(take(1), share());
  }

  create(body: DeviceItem, applicationId) {
    return this.service
      .post<DeviceItem>(
        `${this.BASE_URL}/applications/${applicationId}/devices`,
        body,
        {
          headers: this.headers,
        },
      )
      .pipe(take(1));
  }

  update(applicationId: string, deviceId, body: DeviceItem) {
    return this.service
      .put(
        `${this.BFF_URL}/applications/${applicationId}/devices/${deviceId}`,
        body,
      )
      .pipe(take(1));
  }

  getBySourceInfo(applicationId: string, sourceValue: string) {
    return this.service
      .get<Devices>(
        `${this.BFF_URL}/applications/${applicationId}/devices?sourceInfoValue=${sourceValue}`,
      )
      .pipe(take(1), share());
  }

  getByAssociation(applicationId: string, associated: string) {
    return this.service
      .get(
        `${this.BFF_URL}/applications/${applicationId}/devices?associated=${associated}`,
      )
      .pipe(share());
  }

  getBySourceAndAssociation(
    applicationId: string,
    sourceValue: string,
    associated: string,
  ) {
    return this.service
      .get(
        `${this.BFF_URL}/applications/${applicationId}/devices?sourceInfoValue=${sourceValue}&associated=${associated}`,
      )
      .pipe(share());
  }

  postImportDevice(applicationId: string, importDevices: ImportDevices) {
    return this.service
      .post(
        `${this.BFF_URL}/applications/${applicationId}/devices/import`,
        importDevices,
      )
      .pipe(take(1));
  }

  getDeviceAndAssociationInformation(
    applicationId: string,
    groupId: string,
    deviceSourceValue: string,
  ) {
    return this.service
      .get<Devices>(
        `${this.BFF_URL}/applications/${applicationId}/devices/${groupId}/${deviceSourceValue}`,
      )
      .pipe(take(1));
  }

  getDeviceMovementHistoryInformation(
    applicationId: string,
    deviceId: string,
  ): Observable<MovementHistoryListResponse[]> {
    return this.service
      .get<MovementHistoryListResponse[]>(
        `${this.BFF_URL}/applications/${applicationId}/devices/${deviceId}/movementHistory`,
      )
      .pipe(take(1));
  }
}
