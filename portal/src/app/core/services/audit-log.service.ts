import { Injectable } from '@angular/core';
import { AuditLogRepository } from '../repositories/audit-log.repository';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  public createAuditLog(status: number): void {
    this.auditLogRepository.createAuditLog(status);
  }
}
