import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import Application from '../../shared/models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationRepository {
  constructor(private http: HttpClient) {}

  public listAllApplications(): Observable<Application[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/application`;
    return this.http.get<Application[]>(uri);
  }

  public listAllApplicationsFromMiddleware(): Observable<Application[]> {
    const uri = `${environment.locationBff}Application/Middleware`;
    return this.http.get<Application[]>(uri);
  }
}
