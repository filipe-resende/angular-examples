import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationSitesRepository {
  constructor(private http: HttpClient) {}

  public getSiteByName(
    long: number,
    lat: number
  ): Observable<Array<{ name: string; description: string }>> {
    const uri = `${environment.locationSuiteBff}/api/v1/geographic-locations/areas`;
    let params: HttpParams = new HttpParams();

    params = params.append('lon', `${long}`);
    params = params.append('lat', `${lat}`);

    return this.http.get<any>(uri, { params });
  }
}
