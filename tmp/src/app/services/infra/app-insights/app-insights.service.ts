import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LoggingEventsNames } from 'src/app/core/constants/logging-event-names.const';
import { AppInsightsLogObject } from './AppInsightsLogObject';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInsightsService {
  private readonly BASE_URL = environment.appInsightsApi();

  private headers = environment.appInsightsApiKey;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getLastTwoLoginEvents(
    timespan = 'P90D',
  ): Observable<AppInsightsLogObject> {
    const userEmail = this.authService.getUserInfo().mail;
    const uri = `${this.BASE_URL}/events/customEvents`;

    const params = new HttpParams()
      .append('timespan', timespan)
      .append('$filter', `customDimensions/UserName eq '${userEmail}'`)
      .append('$select', 'timestamp')
      .append('$search', LoggingEventsNames.Login)
      .append('$top', '2');
    return this.http.get<AppInsightsLogObject>(uri, {
      params,
      headers: this.headers,
    });
  }
}
