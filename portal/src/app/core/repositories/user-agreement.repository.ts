import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserAgreement } from '../../shared/models/UserAgreement';
import { UserAgreementDocument } from '../../shared/models/UserAgreementDocument';

@Injectable({
  providedIn: 'root',
})
export class UserAgreementRepository {
  constructor(private http: HttpClient) {}

  public acceptUserAgreement(
    documentId: string,
    userId: string,
  ): Observable<UserAgreement> {
    const uri = `${environment.locationBff}userAgreement`;

    return this.http.post<UserAgreement>(uri, { documentId, userId });
  }

  public getCurrentAgreementDocument(): Observable<UserAgreementDocument> {
    const uri = `${environment.locationBff}userAgreement/latestDocument/platform/${environment.plataformName}`;

    return this.http.get<UserAgreementDocument>(uri);
  }

  public getLastUserAcceptance(
    documentId: string,
    userId: string,
  ): Observable<UserAgreement> {
    const uri = `${environment.locationBff}userAgreement/user/${userId}/document/${documentId}`;

    return this.http.get<UserAgreement>(uri);
  }
}
