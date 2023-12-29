/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ApplicationDevicesAssociationSummary,
  ApplicationItem,
  Applications,
} from '../../model/applications-interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private readonly BASE_URL = `${environment.thingsManagementApiUrl}/applications`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(skip = 0, page = 0) {
    return this.http
      .get<Applications>(`${this.BASE_URL}/?skip=${skip}&count=${page}`, {
        headers: this.headers,
      })
      .pipe(take(1), share());
  }

  listApplicationsAvailableForUser() {
    return this.http
      .get<ApplicationItem[]>(
        `${environment.thingsManagementBffUrl}/applications`,
      )
      .toPromise();
  }

  listApplicationsWithIncluseGroupOption(): Observable<ApplicationItem[]> {
    return this.http
      .get<ApplicationItem[]>(
        `${environment.thingsManagementBffUrl}/applications/listApplicationsWithInclusionDeviceGroup`,
      )
      .pipe(take(1));
  }

  getById(id: string) {
    return this.http
      .get<ApplicationItem>(`${this.BASE_URL}/${id}`, {
        headers: this.headers,
      })
      .pipe(take(1), share());
  }

  public exportDevices(
    applicationId: string,
    recipientEmail: string,
  ): Observable<void> {
    return this.http.post<any>(
      `${environment.thingsManagementBffUrl}/applications/${applicationId}/devices/export`,
      null,
      {
        params: new HttpParams().append('email', recipientEmail),
      },
    );
  }

  getDevicesAssociationSummary(applicationId: string) {
    return this.http
      .get<ApplicationDevicesAssociationSummary>(
        `${this.BASE_URL}/${applicationId}/devices/count-summary`,
        {
          headers: this.headers,
        },
      )
      .pipe(take(1), share());
  }
}
