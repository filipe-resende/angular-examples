import { Injectable } from '@angular/core';
import {
  AuditLogRepository,
  ILoginAuditLog,
} from 'src/app/core/repositories/audit-log.repository';
import { ImportDevices } from 'src/app/model/import-devices-interface';
import { AuditLogStatus } from 'src/app/shared/enums/auditLogStatus';
import { UserProfileService } from 'src/app/stores/user-profile/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  constructor(
    private auditLogRepository: AuditLogRepository,
    private userProfileService: UserProfileService,
  ) {}

  public createAuditLog(status: AuditLogStatus): void {
    const user = this.userProfileService.getUserInfo();
    this.auditLogRepository.createAuditLog({
      userEmail: user.mail,
      userName: user.UserFullName,
      status,
      portalKey: 'TMP',
    } as ILoginAuditLog);
  }

  public getLoadLogByUserEmailAndDateTime(
    email: string,
    date: Date,
    numberVSC: string,
  ) {
    this.auditLogRepository
      .getLoadLogByUserEmailAndDateTime(email, date)
      .subscribe(
        result => {
          this.downloadFile(result, numberVSC);
        },
        () => {
          window.alert('Falha ao realizar o download, tente novamente!');
        },
      );
  }

  public downloadLoadLog(email: string, numberVSC: string) {
    this.auditLogRepository.getLoadLogByUserEmail(email).subscribe(
      result => {
        this.downloadFile(result, numberVSC);
      },
      () => {
        window.alert('Falha ao realizar o download, tente novamente!');
      },
    );
  }

  private downloadFile(result: string, numberVSC?: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const downloadLink = document.createElement('a');
    downloadLink.href = mediaType + result;
    downloadLink.download = `TMP_Log_da_Carga_${numberVSC}.xlsx`;
    downloadLink.textContent = 'Download file!';
    downloadLink.click();
  }

  public exportLoadLog(email: string, importDevices: ImportDevices) {
    this.auditLogRepository
      .exportLoadLogByUserEmail(email, importDevices)
      .subscribe();
  }
}
