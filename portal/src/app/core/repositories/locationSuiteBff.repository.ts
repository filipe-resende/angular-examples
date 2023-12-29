import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ThingsManagmentDevice } from '../../shared/models/thingsManagmentDevice';

@Injectable({
  providedIn: 'root'
})
export class LocationSuiteBffRepository {
  constructor(private http: HttpClient) {}

  public getDeviceByApplicationIdAndSourceInfoValue(
    applicationId: string,
    sourceInfoValue: string
  ): Observable<ThingsManagmentDevice> {
    const uri = `${environment.locationSuiteBff}/api/v1/device?applicationId=${applicationId}&sourceInfoValue=${sourceInfoValue}`;
    return this.http.get<ThingsManagmentDevice>(uri);
  }
}
