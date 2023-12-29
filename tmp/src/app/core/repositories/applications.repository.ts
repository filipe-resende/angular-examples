import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApplicationItem,
  ApplicationRequest,
  ApplicationsListResponse,
  ApplicationDevicesAssociationSummary,
} from 'src/app/model/applications-interfaces';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationsRepository {
  private readonly BASE_URL = `${environment.thingsManagementApiUrl}/applications`;

  private readonly BFF_BASE_URL = `${environment.thingsManagementBffUrl}/applications`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  public getApplications(
    skip?: number,
    count?: number,
  ): Observable<ApplicationsListResponse> {
    let params: HttpParams = new HttpParams();

    if (skip) params = params.append('skip', `${skip}`);
    if (count) params = params.append('count', `${count}`);

    return this.http.get<ApplicationsListResponse>(this.BASE_URL, {
      params,
      headers: this.headers,
    });
  }

  public getApplicationById(id: string): Observable<ApplicationItem> {
    return this.http.get<ApplicationItem>(`${this.BASE_URL}/${id}`, {
      headers: this.headers,
    });
  }

  public create(application: ApplicationRequest): Observable<ApplicationItem> {
    return this.http.post<ApplicationRequest>(
      `${this.BFF_BASE_URL}`,
      application,
    );
  }

  public update(
    applicationId: string,
    application: ApplicationRequest,
  ): Observable<ApplicationItem> {
    return this.http.put<ApplicationRequest>(
      `${this.BFF_BASE_URL}/${applicationId}`,
      application,
    );
  }

  public getDevicesAssociationSummary(
    applicationId: string,
  ): Observable<ApplicationDevicesAssociationSummary> {
    return this.http.get<ApplicationDevicesAssociationSummary>(
      `${this.BASE_URL}/${applicationId}/devices/count-summary`,
      {
        headers: this.headers,
      },
    );
  }
}
