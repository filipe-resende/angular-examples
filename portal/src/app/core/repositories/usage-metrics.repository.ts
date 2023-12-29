import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UsageMetrics } from '../../shared/models/usageMetrics';

@Injectable({
  providedIn: 'root'
})
export class UsageMetricsServiceRepository {
  constructor(private http: HttpClient) {}

  public GetUsageMetrics(
    month?: number,
    year?: number
  ): Observable<UsageMetrics[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/UsageMetrics`;

    if (month === undefined && year === undefined) {
      return this.http.get<UsageMetrics[]>(uri).pipe(take(1));
    }

    let params: HttpParams = new HttpParams();
    params = params.append('year', year);
    params = params.append('month', month);

    return this.http.get<UsageMetrics[]>(uri, { params }).pipe(take(1));
  }
}
