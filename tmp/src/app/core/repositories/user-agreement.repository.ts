import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { UserAgreementDocument } from '../../model/user-agreement-document';
import { UserAgreement } from '../../model/user-agreement';

@Injectable({
  providedIn: 'root',
})
export class UserAgreementRepository {
  private readonly BASE_URL = environment.userAgreementApiUrl;

  private readonly thingsManagementPortalName = environment.platformName;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  public getCurrentAgreementDocument(): Observable<UserAgreementDocument> {
    const uri = `${this.BASE_URL}/documents/latest/platform/${this.thingsManagementPortalName}`;

    return this.http.get<UserAgreementDocument>(uri, { headers: this.headers });
  }

  public acceptUserAgreement(
    documentId: string,
    userId: string,
  ): Observable<UserAgreement> {
    const uri = `${this.BASE_URL}/userAgreements`;
    const userAgreement = { documentId, userId };

    return this.http.post<UserAgreement>(uri, userAgreement, {
      headers: this.headers,
    });
  }

  public getLastUserAcceptance(
    documentId: string,
    userId: string,
  ): Observable<UserAgreement> {
    const uri = `${this.BASE_URL}/userAgreements/userAcceptance/user/${userId}/document/${documentId}`;

    return this.http.get<UserAgreement>(uri, { headers: this.headers });
  }
}
