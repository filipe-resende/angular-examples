import { Injectable } from '@angular/core';
import { filter} from 'rxjs/operators';
import { NotificationsService } from '../../stores/notifications/notifications.service';
import { PanicAlertService } from '../../stores/panic-alert/panic-alert.service';
import { PerimetersService } from '../../stores/perimeters/perimeters.service';
import { SitesService } from '../../stores/sites/sites.service';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';
import { AccessControlService } from './access-control/access-control.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor(
    private sitesService: SitesService,
    private perimetersService: PerimetersService,
    private panicAlertService: PanicAlertService,
    private notificationsService: NotificationsService,
    private userProfileService: UserProfileService,
    private accessControlService: AccessControlService
  ) {}

  public async preloadAllStores(): Promise<void> {
    this.userProfileService.userProfile$
      .pipe(filter(userProfile => !!userProfile))
      .subscribe(user => {
        this.sitesService.syncSites().then(() => {
          const site = this.sitesService.getSelectedSite();

          if (site && Object.keys(site).length) {
            this.perimetersService.syncPerimetersBySite(site);
          }
        });

        this.notificationsService.initListeners();

        this.panicAlertService.initListeners();

        this.sendUserAccessInfoToBff(user.iamId);
      });
  }

  /**
   * For compatibility reasons with the notifications API, we've kept the iamId as the email username.
   */
  public sendUserAccessInfoToBff(iamId: string): void {
    this.accessControlService.sendUserAccessPayload(iamId);
  }
}
