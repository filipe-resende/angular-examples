/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssociationPeriodsService {
  private readonly BASE_URL = `${environment.thingsManagementApiUrl}`;

  private readonly BFF_URL = `${environment.thingsManagementBffUrl}`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  public getDeviceAssociations(applicationId: string, deviceId: string) {
    return this.http
      .get(
        `${
          this.BFF_URL
        }/applications/${applicationId}/devices/${deviceId}/associationPeriods?start=2019-01-04&end=${this.datePipe.transform(
          Date.now(),
          'yyyy-MM-dd',
          '+24',
        )}&count=10`,
      )
      .pipe(take(1), share());
  }

  public getThingsAssociations(thingId: string, start: string, end: string) {
    return this.http
      .get(
        `${this.BFF_URL}/things/${thingId}/associationPeriods?start=${start}&end=${end}&count=10`,
        { headers: this.headers },
      )
      .pipe(take(1), share());
  }

  public create(thingId: string, body) {
    return this.http
      .post(`${this.BFF_URL}/things/${thingId}/associate`, body, {
        headers: this.headers,
      })
      .pipe(take(1), share());
  }

  public disassociate(thingId: string, periodId: string, body) {
    return this.http
      .patch(
        `${this.BFF_URL}/things/${thingId}/disassociate/${periodId}`,
        body,
        { headers: this.headers },
      )
      .pipe(take(1), share());
  }
}
