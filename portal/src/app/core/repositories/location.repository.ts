import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceLocation } from '../../shared/models/device';
import { Thing } from '../../shared/models/thing';
import { ThingByName } from '../../shared/models/thingByName';

export interface ThingDevicesLocation {
  id: string;
  name: string;
  document: string;
  devicesLocation: DeviceLocation[];
}

export enum LocationRepositoryDocumentType {
  cpf = 'CPF',
  iamId = 'Matrícula',
  name = 'Nome'
}

@Injectable({
  providedIn: 'root'
})
export class LocationRepository {
  constructor(private http: HttpClient) {}

  public thingNameByMatricula(matricula: string): Observable<any> {
    const uri = `${environment.locationBff}Thing/Matricula/${matricula}`;
    return this.http.get<any>(uri, { observe: 'response' });
  }

  public getAllThingsByLastLocation(
    siteName: string,
    minutes?: number,
    deviceType?: string
  ): Observable<Thing[]> {
    let params = new HttpParams();

    if (minutes) {
      params = params.append('minutes', minutes.toString());
    }

    if (deviceType) {
      params = params.append('deviceType', deviceType);
    }

    const uri = `${
      environment.locationSuiteBff
    }/api/v1/things/last/events/site/${encodeURIComponent(siteName)}`;

    return this.http.get<Thing[]>(uri, { params });
  }

  public getAllThingsByLastLocationInsideGeofence(
    geofenceId: string,
    minutes?: number,
    deviceType?: string
  ): Observable<Thing[]> {
    let params = new HttpParams();

    if (minutes) {
      params = params.append('minutes', minutes.toString());
    }

    if (deviceType) {
      params = params.append('deviceType', deviceType);
    }

    const uri = `${environment.locationBff}Location/Things/All/Position/Last/Geofence/${geofenceId}`;
    return this.http.get<Thing[]>(uri, { params });
  }

  public getThingsByName(name: string): Observable<ThingByName[]> {
    const uri = `${environment.locationBff}Thing/byName/${name}`;
    return this.http.get<ThingByName[]>(uri);
  }

  public countAllThingsByLastLocation(
    siteName: string,
    minutes?: number
  ): Observable<number> {
    let params = new HttpParams();

    if (minutes) {
      params = params.append('minutes', minutes.toString());
    }

    const uri = `${
      environment.locationSuiteBff
    }/api/v1/all/things/count/by-region/${encodeURIComponent(siteName)}`;

    return this.http.get<number>(uri, { params });
  }

  public getMultipleDevicesLocationByThing(
    thingId: string,
    from?: string,
    till?: string,
    intervalInMinutes?: number
  ): Observable<ThingDevicesLocation> {
    let params = new HttpParams();

    const date = new Date();

    if (from && till)
      params = params
        .append('periodFrom', `${from}`)
        .append('periodTo', `${till}`);

    from = this.subtractHours(date, intervalInMinutes).toISOString();
    const uri = `${
      environment.locationSuiteBff
    }/api/v1/location-events-history/things/${thingId}/devices-locations?periodFrom=${from}&periodTo=${date.toISOString()}`;
    return this.http.get<ThingDevicesLocation>(uri, { params });
  }

  public getMultipleDevicesLocationByDocument(
    documentType: LocationRepositoryDocumentType,
    document: string,
    from?: string,
    till?: string
  ): Observable<ThingDevicesLocation> {
    let uri;

    if (documentType === LocationRepositoryDocumentType.cpf) {
      uri = `${
        environment.locationBff
      }Location/Things/Position/MultiDevices?cpf=${document}${
        from ? `&periodFrom=${from}` : ''
      }${till ? `&periodTo=${till}` : ''}`;
    }

    if (documentType === LocationRepositoryDocumentType.iamId) {
      uri = `${
        environment.locationBff
      }Location/Things/Position/MultiDevices?iamId=${document}${
        from ? `&periodFrom=${from}` : ''
      }${till ? `&periodTo=${till}` : ''}`;
    }

    if (documentType === LocationRepositoryDocumentType.name) {
      uri = `${
        environment.locationBff
      }Location/Things/Position/MultiDevices?name=${encodeURIComponent(
        `${document}`
      )}${from ? `&periodFrom=${from}` : ''}${till ? `&periodTo=${till}` : ''}`;
    }
    return this.http.get<ThingDevicesLocation>(uri);
  }

  private subtractHours(date, timeIntervalInMinutes) {
    const newDate = new Date(date - timeIntervalInMinutes * 60000);

    return newDate;
  }
}
