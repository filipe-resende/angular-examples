import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImportDevices } from 'src/app/model/import-devices-interface';
import { UserStateService } from 'src/app/stores/user/user-state.service';
import { environment } from '../../../environments/environment';
import { AuditLogStatus } from '../../shared/enums/auditLogStatus';

export interface ILoginAuditLog {
  userEmail: string;
  userName: string;
  status: AuditLogStatus;
  portalKey: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuditLogRepository {
  constructor(
    private userStateService: UserStateService,
    private http: HttpClient,
  ) {}

  public createAuditLog(loginAuditLog: ILoginAuditLog): void {
    const formData = new FormData();
    formData.append('UserEmail', loginAuditLog.userEmail);
    formData.append('UserName', loginAuditLog.userName);
    formData.append('Status', loginAuditLog.status.toString());
    formData.append('PortalKey', loginAuditLog.portalKey);

    this.http
      .post<void>(`${environment.thingsManagementBffUrl}/auditlog`, formData)
      .subscribe(
        () => this.userStateService.updateAccessLog(true),
        error => {
          // eslint-disable-next-line no-console
          console.error('HTTP Error', error);
        },
      );
  }

  public getLoadLogByUserEmailAndDateTime(email: string, date: Date) {
    const dateString = new Date(date);
    return this.http.get(
      `${
        environment.thingsManagementBffUrl
      }/auditlog/ExportDevicesLoadLog/GetDateAndEmail?userEmail=${email}&date=${dateString.toISOString()}`,
      { responseType: 'text' },
    );
  }

  public getLoadLogByUserEmail(email: string) {
    return this.http.get(
      `${environment.thingsManagementBffUrl}/auditlog/ExportDevicesLoadLogByDownload?userEmail=${email}`,
      { responseType: 'text' },
    );
  }

  public exportLoadLogByUserEmail(email: string, importDevices: ImportDevices) {
    return this.http.post(
      `${environment.thingsManagementBffUrl}/auditlog/ExportDevicesLoadLogToEmail?userEmail=${email}`,
      importDevices,
    );
  }
}
