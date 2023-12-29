import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import { Site } from '../../shared/models/site';
import { Telemetry } from '../../shared/models/telemetry';

export interface TransportsListResponse {
  code: string;
  line: string;
  lastLocationLongitude: number;
  lastLocationLatitude: number;
  registrationDate: string;
  direction?: string;
  category?: string;
  people?: number;
  licensePlate?: string;
  initialPointLongitude?: number;
  initialPointLatitude?: number;
  finalPointLongitude?: number;
  finalPointLatitude?: number;
  badgeRegistrationDate: string;
  finalDateTrip: string;
}

export interface TransportsTripThings {
  cardId: string;
  document: string;
  name: string;
  type: string;
  company: string;
  location: number[];
  date: string;
}

export enum BusTripCounterType {
  total = 'TOTAL',
  toVale = 'TOVALE',
  fromVale = 'FROMVALE',
  circular = 'CIRCULAR',
  landedInsideVale = 'LANDED_INSIDE',
  landedOutsideVale = 'LANDED_OUTSITE'
}

@Injectable({
  providedIn: 'root'
})
export class TransportsRepository {
  constructor(private http: HttpClient) {}

  public getTripsPaginated(
    page = 0,
    pageSize = 10,
    site: Site,
    from?: string,
    till?: string,
    line?: string,
    direction?: string,
    plate?: string,
    telemetry?: string
  ): Observable<{ headers: HttpHeaders; body: TransportsListResponse[] }> {
    let params: HttpParams = new HttpParams();

    if (from && till) {
      params = params.append('periodFrom', from);
      params = params.append('periodTo', till);
    }

    if (line) {
      params = params.append('line', line);
    }

    if (direction) {
      params = params.append('direction', direction);
    }

    if (plate) {
      params = params.append('busPlate', plate);
    }

    if (telemetry) {
      params = params.append('telemetry', telemetry);
    }

    if (site) {
      params = params.append('site', site.name);
    }

    const uri = `${environment.locationSuiteBff}/api/v1/Bus/Trips/All/${page}/${pageSize}`;

    return this.http.get<TransportsListResponse[]>(uri, {
      params,
      observe: 'response'
    });
  }

  public getTripThings(
    { name: siteName }: Site,
    tripCode: string,
    from?: string,
    till?: string
  ): Observable<TransportsTripThings[]> {
    let params: HttpParams = new HttpParams();

    if (from && till) {
      params = params.append('periodFrom', from);
      params = params.append('periodTo', till);
    }

    const uri = `${
      environment.locationSuiteBff
    }/api/v1/Displacements/Trips/Passengers/${encodeURIComponent(
      siteName
    )}/${tripCode}`;

    return this.http.get<TransportsTripThings[]>(uri, { params });
  }

  public listTransportsBySite(
    site: Site,
    filter: Paginator,
    from?: string,
    till?: string
  ): Observable<any> {
    let params: HttpParams = new HttpParams().append(
      'siteType',
      `${site.type}`
    );

    if (from && till) {
      params = params.append('periodFrom', from);
      params = params.append('periodTo', till);
    }

    const uri = `${
      environment.locationBff
    }Bus/CardId/Last/Position/${encodeURIComponent(site.name)}/${filter.page}/${
      filter.perPage
    }`;

    return this.http.get<any>(uri, { params, observe: 'response' });
  }

  public getTelemetryCompanies(): Observable<Telemetry[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/displacements/telemetry-providers`;
    return this.http.get<Telemetry[]>(uri);
  }
}
