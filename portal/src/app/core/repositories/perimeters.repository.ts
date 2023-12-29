import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Perimeter } from '../../shared/models/perimeter';
import { OfficialPerimeter } from '../../shared/models/officialPerimeter';

@Injectable({
  providedIn: 'root'
})
export class PerimetersRepository {
  constructor(private http: HttpClient) {}

  public getOfficialValePerimetersBySite(
    siteId: string
  ): Observable<OfficialPerimeter[]> {
    const headers = this.getGeographicDefaultHeader();

    const uri = `${environment.geographUri}Perimeter/All?site=${siteId}`;
    return this.http.get<OfficialPerimeter[]>(uri, { headers });
  }

  public getValePerimetersBySite(siteName: string): Observable<Perimeter[]> {
    const uri = `${
      environment.locationSuiteBff
    }/api/v1/ValeAreasManagement/Site/${encodeURIComponent(
      siteName
    )}/OfficialPerimeters`;
    return this.http.get<Perimeter[]>(uri);
  }

  public postOfficialPerimeter(
    name: string,
    geojson: {
      type: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
      properties: { name: string };
    },
    siteIdList: string[]
  ): Observable<void> {
    const headers = this.getGeographicDefaultHeader();

    const uri = `${environment.geographUri}Perimeter`;
    const body = {
      name,
      geojson,
      sites: siteIdList
    };

    return this.http.post<void>(uri, body, { headers });
  }

  public putOfficialPerimeter(
    perimeterId: string,
    name: string,
    geojson: {
      type: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
      properties: { name: string };
    },
    siteIdList: string[]
  ): Observable<void> {
    const headers = this.getGeographicDefaultHeader();

    const uri = `${environment.geographUri}Perimeter/${perimeterId}`;
    const body = {
      name,
      geojson,
      sites: siteIdList,
      status: true
    };

    return this.http.put<void>(uri, body, { headers });
  }

  public deleteOfficialPerimeter(perimeterId: string): Observable<void> {
    const headers = this.getGeographicDefaultHeader();

    const uri = `${environment.geographUri}Perimeter/${perimeterId}`;

    return this.http.delete<void>(uri, { headers });
  }

  private getGeographicDefaultHeader() {
    return {
      'x-api-version': '2'
    };
  }
}
