import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PeopleLogStatus } from '../../../shared/enums/peopleLogStatus';
import { PORTAL_KEY } from '../../constants/portal-key.const';
import { IPeopleLog } from '../../../shared/interfaces/people-log.interface';

@Injectable({
  providedIn: 'root'
})
export class PeopleRepository {
  constructor(private http: HttpClient) {}

  createPeopleLog(site: string, userEmail: string, status: number): void {
    const peopleLog: IPeopleLog = {
      userEmail,
      site,
      portalKey: PORTAL_KEY,
      status: PeopleLogStatus[status]
    };

    this.http
      .post<IPeopleLog>(
        `${environment.locationSuiteBff}/api/v1/people/export`,
        peopleLog
      )
      .subscribe();
  }
}
