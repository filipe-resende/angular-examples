import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { FlightOrGateEventType } from '../../shared/enums/flightsAndGates';
import { PaginatedList } from '../../shared/models/paginated-list';
import { Flights } from '../../shared/models/flights';
import { FlightsPassengers } from '../../shared/models/flights-passangers';
import { FlightsCounter } from '../../shared/models/flights-counter';

@Injectable({
  providedIn: 'root'
})
export class FlightsRepository {
  constructor(private http: HttpClient) {}

  private readonly FIVE_MINUTES_TIMEOUT_IN_MILISECONDS = 300000;

  private readonly options = {
    timeout: this.FIVE_MINUTES_TIMEOUT_IN_MILISECONDS
  };

  public getCounters(from: string, to: string): Observable<FlightsCounter[]> {
    let params: HttpParams = new HttpParams();

    params = params.append('from', from);
    params = params.append('to', to);

    return this.http.get<FlightsCounter[]>(
      `${environment.locationSuiteBff}/api/v1/flights/summary`,
      { params, ...this.options }
    );
  }

  public exportPassengers(
    from: string,
    to: string,
    flight: string,
    airport: string,
    direction: string,
    type: FlightOrGateEventType,
    email: string
  ): Observable<void> {
    const language =
      localStorage.getItem('_culture') === 'en-US' ? 'english' : 'portuguese';

    let params: HttpParams = new HttpParams();

    params = params.append('from', from);
    params = params.append('to', to);
    params = params.append('type', `${type}`);
    params = params.append('direction', direction);
    params = params.append('language', language);

    const uri = `${environment.locationSuiteBff}/api/v1/flights/${flight}/airports/${airport}/passengers/export/to/${email}`;

    return this.http.get<void>(uri, {
      params,
      ...this.options
    });
  }

  public getPassengers(
    from: string,
    to: string,
    flight: string,
    airport: string,
    direction: string,
    type: FlightOrGateEventType,
    pageSize = 10,
    pageIndex = 1
  ): Observable<PaginatedList<FlightsPassengers>> {
    let params: HttpParams = new HttpParams();

    params = params.append('pageIndex', `${pageIndex}`);
    params = params.append('pageSize', `${pageSize}`);
    params = params.append('from', from);
    params = params.append('to', to);
    params = params.append('type', `${type}`);
    params = params.append('direction', direction);

    const uri = `${environment.locationSuiteBff}/api/v1/flights/${flight}/airports/${airport}/passengers`;

    return this.http.get<PaginatedList<FlightsPassengers>>(uri, {
      params,
      ...this.options
    });
  }

  public getFlights(
    from: string,
    to: string,
    pageSize = 10,
    pageIndex = 1,
    type?: FlightOrGateEventType,
    flightNumber?: string
  ): Observable<PaginatedList<Flights>> {
    let params: HttpParams = new HttpParams();

    params = params.append('pageIndex', `${pageIndex}`);
    params = params.append('pageSize', `${pageSize}`);
    params = params.append('from', from);
    params = params.append('to', to);

    if (type) {
      params = params.append('type', `${type}`);
    }

    if (flightNumber) {
      params = params.append('flightNumber', flightNumber);
    }

    return this.http.get<PaginatedList<Flights>>(
      `${environment.locationSuiteBff}/api/v1/flights`,
      { params, ...this.options }
    );
  }
}
