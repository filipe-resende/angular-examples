import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NotificationSettingsOverlayComponent } from '../../components/smart/notification-settings-overlay/notification-settings-overlay.component';
import { Extensions } from '../../shared/extensions';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';
import { NotificationsService } from '../../stores/notifications/notifications.service';
import { FeatureFlagsStateService } from '../../stores/feature-flags/feature-flags-state.service';
import { FeatureFlags } from '../../core/constants/feature-flags.const';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsPage implements OnInit, OnDestroy {
  public showDeviceGroupDisclaimer = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private featureFlagsStateService: FeatureFlagsStateService
  ) {}

  public ngOnInit(): void {
    this.setupBreadcrumb();
    this.notificationsService.setAllNotificationSeen();

    const featureflagsSubscription$ =
      this.featureFlagsStateService.activeFeatureFlags$.subscribe(
        featureFlags => {
          this.showDeviceGroupDisclaimer = featureFlags.some(
            featureFlag =>
              featureFlag.name === FeatureFlags.DeviceGroupDisclaimer
          );
        }
      );
    this.subscriptions.push(featureflagsSubscription$);
  }

  public ngOnDestroy(): void {
    this.tearDownBreadcrumb();

    if (this.subscriptions)
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public openNotificationSettings(): void {
    this.dialog.open(NotificationSettingsOverlayComponent, {
      disableClose: true,
      width: Extensions.isMobile.any() ? '100%' : 'auto'
    });
  }

  private setupBreadcrumb() {
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/notifications',
      text: 'SIDEBAR.NOTIFICATIONS_TEXT'
    });
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
  }

  private tearDownBreadcrumb() {
    this.breadcrumbService.popBreadcrumbItem();
    this.breadcrumbService.updateBreadcrumbVisibilityTo(false);
  }
}
