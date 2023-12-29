import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  appInsights: ApplicationInsights;

  constructor(private authService: AuthService) {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsights.instrumentationKey,
        enableAutoRouteTracking: true, // option to log all route changes
      },
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(name?: string, url?: string) {
    // option to call manually
    this.appInsights.trackPageView({
      name,
      uri: url,
    });
    this.appInsights.flush();
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name }, properties);
    this.appInsights.flush();
  }

  logEventWithUserInfo(name: string) {
    this.logEvent(name, this.getUserInfo());
  }

  public getUserInfo = () => ({
    User: this.authService.getUserInfo().UserFullName,
    UserName: this.authService.getUserInfo().mail,
  });

  logMetric(
    name: string,
    average: number,
    properties?: { [key: string]: any },
  ) {
    this.appInsights.trackMetric({ name, average }, properties);
    this.appInsights.flush();
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights.trackException({
      exception,
      severityLevel,
    });
    this.appInsights.flush();
  }

  logTrace(
    message: string,
    properties?: { [key: string]: any },
    severityLevel?: number,
  ) {
    this.appInsights.trackTrace({ message, severityLevel }, properties);
    this.appInsights.flush();
  }
}
