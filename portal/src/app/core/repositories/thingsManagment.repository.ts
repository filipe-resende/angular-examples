import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThingsManagmentDevice } from '../../shared/models/thingsManagmentDevice';
import { environment } from '../../../environments/environment';
import Application from '../../shared/models/application';

@Injectable({
  providedIn: 'root'
})
export class ThingsManagmentRepository {
  private httpOptions: {
    headers: HttpHeaders;
  };

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(
          `${environment.thingsManagmentUsername}:${environment.thingsManagmentPassword}`
        )}`
      })
    };
  }

  public getApplicationById(applicationId: string): Observable<Application> {
    const uri = `${environment.thingsManagmentUri}applications/${applicationId}`;
    return this.http.get<Application>(uri, this.httpOptions);
  }

  public listThings(): Observable<any> {
    const uri = `${environment.thingsManagmentUri}things`;
    return this.http.get<any>(uri, this.httpOptions);
  }

  public getThingBySourceInfo(
    applicationId: string,
    sourceType: string,
    sourceValue: string
  ) {
    const uri = `${environment.thingsManagmentUri}applications/${applicationId}/devices/bySourceInfo/${sourceType}/${sourceValue}`;
    return this.http.get<ThingsManagmentDevice>(uri, this.httpOptions);
  }
}
