import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationSettings } from '../../../shared/models/notificationSettings';
import { AccessControlService } from '../access-control/access-control.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationSettingsService {
  constructor(private accessControlService: AccessControlService) {}

  public getNotificationsSettingsPreferences(
    iamId: string,
  ): Observable<NotificationSettings> {
    return this.accessControlService.getUserAccessPermissions(iamId);
  }

  public setNotificationsSettingsPreferences(
    settings: NotificationSettings,
  ): Observable<NotificationSettings> {
    return this.accessControlService.setAccessPermissions(settings);
  }
}
