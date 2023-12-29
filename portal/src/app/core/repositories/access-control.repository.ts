import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationSettings } from '../../shared/models/notificationSettings';
import { environment } from '../../../environments/environment';
import { HasAccessToSite } from '../../shared/models/hasAccessToSite';
// cai no catch! => Work around

@Injectable({
  providedIn: 'root'
})
export class AccessControlRepository {
  constructor(private http: HttpClient) {}

  private USER_URI = 'api/v1/users';

  public checkUserAccessByLatLong(
    latitude: number,
    longitude: number
  ): Observable<HasAccessToSite> {
    const uri = `${environment.locationSuiteBff}/${this.USER_URI}/access/site`;

    let params: HttpParams = new HttpParams();
    params = params.append('longitude', `${longitude}`);
    params = params.append('latitude', `${latitude}`);

    return this.http.get<HasAccessToSite>(uri, { params });
  }

  public setAccessControlNotificationsSettings(
    settings: NotificationSettings
  ): Observable<NotificationSettings> {
    return this.http.post<NotificationSettings>(
      `${environment.locationBff}/AccessControl/Userpermissions`,
      { settings }
    );
  }
}
