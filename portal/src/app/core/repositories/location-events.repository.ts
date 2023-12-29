import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { Geofence } from '../../shared/models/geofence';
import { LocationEventsEnrichedThings } from '../../shared/models/locationEventsEnrichedThings';
import { ThingDevicesLocation } from './location.repository';
import { ThingsExpirationSearchParams } from '../../shared/models/things-search-params';

export enum LocationRepositoryDocumentType {
  cpf = 'CPF',
  iamId = 'Matrícula',
  name = 'Nome'
}

@Injectable({
  providedIn: 'root'
})
export class LocationEventsRepository {
  private readonly LOCATION_EVENTS_MULTIPLE_DEVICES_URI: string =
    '/api/v1/location-events-history/things';

  private readonly LOCATION_EVENTS_URI = 'api/v2/LocationEvents/Site';

  constructor(private http: HttpClient) {}

  public exportListThingsLastLocations({
    siteName,
    email,
    perimeters,
    periodInMinutes,
    deviceType,
    isRealTime
  }: {
    siteName: string;
    email: string;
    perimeters?: Geofence[] | string;
    periodInMinutes?: number;
    deviceType?: string;
    isRealTime?: boolean;
  }): Observable<void> {
    const uri = `${environment.locationSuiteBff}/${this.LOCATION_EVENTS_URI}/${siteName}/export`;
    const geofencesNames =
      typeof perimeters === 'string'
        ? perimeters
        : perimeters?.map(({ name }) => name).join(',');

    let params = new HttpParams();

    params = params.append('userEmail', email);

    params = params.append('minutes', periodInMinutes.toString());

    if (geofencesNames) {
      params = params.append('geofences', geofencesNames);
    }

    if (deviceType) {
      params = params.append('deviceType', deviceType);
    }

    if (isRealTime) {
      params = params.append('isRealTime', isRealTime);
    }
    return this.http.post<void>(uri, null, { params });
  }

  public listThingsLastLocationsByGeofences({
    siteName,
    minutes,
    initialDate,
    geofences,
    deviceType,
    isRealTimeSearch
  }: {
    siteName: string;
    minutes?: number;
    initialDate?: Date;
    geofences?: Geofence[] | string;
    deviceType?: string;
    isRealTimeSearch?: boolean;
  }): Observable<LocationEventsEnrichedThings> {
    const uri = `${environment.locationSuiteBff}/${this.LOCATION_EVENTS_URI}/${siteName}`;

    const geofencesNames =
      typeof geofences === 'string'
        ? geofences
        : geofences?.map(({ name }) => name).join(',');
    let params = new HttpParams();

    params = params.append(
      'isRealTime',
      (isRealTimeSearch ?? false).toString()
    );

    if (minutes) {
      params = params.append('minutes', minutes.toString());
    } else {
      params = params.append('initialDate', initialDate.toString());
    }

    if (geofencesNames) {
      params = params.append('geofences', geofencesNames);
    }

    if (deviceType) {
      params = params.append('deviceType', deviceType);
    }

    return this.http.get<LocationEventsEnrichedThings>(uri, { params });
  }

  public getDevicesLocations(
    documentType: LocationRepositoryDocumentType,
    document: string,
    periodFrom?: string,
    periodTo?: string
  ): Observable<ThingDevicesLocation> {
    let uri: string;

    const baseUri = `${environment.locationSuiteBff}${this.LOCATION_EVENTS_MULTIPLE_DEVICES_URI}`;

    switch (documentType) {
      case LocationRepositoryDocumentType.cpf:
        uri = `${baseUri}/cpf/${document}/devices-locations`;
        break;
      case LocationRepositoryDocumentType.iamId:
        uri = `${baseUri}/iam/${document}/devices-locations`;
        break;
      case LocationRepositoryDocumentType.name:
        uri = `${baseUri}/${document}/devices-locations`;
        break;
      default:
        throw new Error(`Invalid document type: ${documentType}`);
    }

    if (periodFrom) {
      uri += `?periodFrom=${periodFrom}`;
    }

    if (periodTo) {
      uri += `&periodTo=${periodTo}`;
    }

    return this.http.get<ThingDevicesLocation>(uri);
  }

  public getThingsbyExpirationTime({
    site,
    initialDate,
    intervalInMinutes
  }: ThingsExpirationSearchParams): Observable<LocationEventsEnrichedThings> {
    const params = new HttpParams()
      .append('InitialDate', moment(initialDate).utc().toISOString())
      .append('Minutes', intervalInMinutes);

    const uri = `${
      environment.locationSuiteBff
    }/api/v1/location-events/things/expired-events/site/${encodeURIComponent(
      site
    )}`;
    return this.http.get<LocationEventsEnrichedThings>(uri, { params });
  }

  public exportPathFromThing({
    email,
    thingId,
    type,
    inicialDate,
    finalDate,
    selectedSite
  }: {
    email: string;
    thingId: string;
    type: string;
    inicialDate: string;
    finalDate: string;
    selectedSite: string;
  }): Observable<void> {
    const uri = `${environment.locationSuiteBff}/api/v1/exporttraject/thingId/${thingId}/searchType/${type}`;

    let params = new HttpParams()
      .append('userEmail', email)
      .append('siteName', selectedSite);

    if (inicialDate) {
      params = params.append('inicialDate', inicialDate);
    }

    if (finalDate) {
      params = params.append('finalDate', finalDate);
    }

    return this.http.post<void>(uri, null, { params });
  }
}
