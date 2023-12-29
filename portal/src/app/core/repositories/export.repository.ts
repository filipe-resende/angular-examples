import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExportDevicesParams } from '../../shared/models/exportDevicesParams';

export interface ExportParams {
  periodFrom: string;
  periodTo: string;
  email: string;
}

export interface ExportDisplacementsParams extends ExportParams {
  siteName: string;
  userName: string;
  siteType: string;
  direction?: string;
  line?: string;
  plate?: string;
  telemetry?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportRepository {
  constructor(private http: HttpClient) {}

  public exportDisplacements({
    siteName,
    email,
    siteType,
    periodTo,
    periodFrom,
    line,
    plate,
    direction,
    telemetry
  }: ExportDisplacementsParams): Observable<void> {
    const timeZoneMin = new Date().getTimezoneOffset() * -1;

    let params = new HttpParams()
      .append('site', `${siteName}`)
      .append('email', `${email}`)
      .append('siteType', `${siteType}`)
      .append('periodFrom', `${periodFrom}`)
      .append('periodTo', `${periodTo}`)
      .append('telemetria', `${telemetry}`)
      .append('timeZoneMin', `${timeZoneMin.toString()}`);

    if (direction) {
      params = params.append('direction', `${direction}`);
    }

    if (line) {
      params = params.append('line', `${line}`);
    }

    if (plate) {
      params = params.append('plate', `${plate}`);
    }

    const uri = `${environment.locationSuiteBff}/api/v1/displacements/export`;
    return this.http.post<void>(uri, null, { params });
  }

  public exportFlightsAndGates(
    userEmail: string,
    periodFrom: string,
    periodTill: string,
    flight?: string,
    flightOrGate?: string
  ): Observable<void> {
    const site = 'voiseys bay';
    let params = new HttpParams();

    if (flight) params = params.append('flight', flight);

    if (flightOrGate) params = params.append('flightOrGate', flightOrGate);

    const language =
      localStorage.getItem('_culture') === 'en-US' ? 'english' : 'portuguese';

    const uri = `${environment.locationBff}flights/site/${site}/from/${periodFrom}/to/${periodTill}/export/in/${language}/to/${userEmail}`;

    return this.http.post<void>(uri, null, { params });
  }

  public exportPeopleByFlights(
    flight: string,
    direction: string,
    periodFrom: string,
    periodTo: string,
    email: string
  ): Observable<void> {
    const site = 'voiseys bay';

    const language =
      localStorage.getItem('_culture') === 'en-US' ? 'english' : 'portuguese';

    const uri = `${environment.locationBff}flights/people/byFlight/${flight}/direction/${direction}/things/site/${site}/from/${periodFrom}/to/${periodTo}/export/in/${language}/to/${email}`;

    return this.http.post<void>(uri, null);
  }

  public exportPeopleByGate(
    direction: string,
    periodFrom: string,
    periodTo: string,
    email: string
  ): Observable<void> {
    const site = 'voiseys bay';

    const language =
      localStorage.getItem('_culture') === 'en-US' ? 'english' : 'portuguese';

    const uri = `${environment.locationBff}flights/people/byGate/direction/${direction}/things/site/${site}/from/${periodFrom}/to/${periodTo}/export/in/${language}/to/${email}`;

    return this.http.post<void>(uri, null);
  }

  public exportDevices({
    email,
    site,
    deviceType,
    deviceNumber
  }: ExportDevicesParams): Observable<void> {
    const params = new HttpParams()
      .append('email', `${email}`)
      .append('site', `${site}`)
      .append('deviceType', `${deviceType}`)
      .append('deviceNumber', `${deviceNumber}`);
    const uri = `${environment.locationSuiteBff}/api/v1/device/export`;

    return this.http.post<void>(uri, null, { params });
  }
}
