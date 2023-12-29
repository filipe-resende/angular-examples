import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationEvents } from 'src/app/shared/interfaces/location-events-metrics.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationMetricsService {
  private readonly BASE_URL = `${environment.thingsManagementBffUrl}/location-events-history`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  getCountByTotalAndByMiddleware(
    year: number,
    month: number,
    isThingSearch = false,
  ) {
    return this.http.get<LocationEvents[]>(
      `${this.BASE_URL}/events-summary?year=${year}&month=${month}&IsThingSearch=${isThingSearch}`,
      {
        headers: this.headers,
      },
    );
  }
}
