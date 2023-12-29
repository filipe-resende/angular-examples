import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../../shared/enums/notificationType';
import { BatteryState } from '../../../shared/enums/batteryState';
import { NotificationsService } from '../../../stores/notifications/notifications.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-low-battery-notifications',
  templateUrl: './low-battery-notifications.component.html',
  styleUrls: ['./low-battery-notifications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LowBatteryNotificationsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) public matSortRef: MatSort;

  public tableColumns: string[] = [
    'status',
    'name',
    'documentId',
    'deviceType',
    'deviceNumber',
    'lastLocation',
    'lastReport',
    'batteryState'
  ];

  public batteryNotificationsTableDataSource: MatTableDataSource<any>;

  public skeletonArray = Array(10);

  public isFetchingNotifications = true;

  private subscriptions: Subscription[] = [];

  public canViewSensitiveData: boolean;

  constructor(
    private notificationsService: NotificationsService,
    private userProfileService: UserProfileService
  ) {}

  public ngOnInit(): void {
    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();

    if (!this.canViewSensitiveData)
      this.tableColumns = this.tableColumns.filter(
        tableColumn => tableColumn !== 'documentId'
      );
    this.notificationsService.ThingsChangeHandler();
    this.onNotificationsChangeHandler();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public getBatteryIconNameByBatteryState(batteryState: BatteryState): string {
    switch (batteryState) {
      case BatteryState.Low:
        return 'Battery_Low.png';
      default:
        return '';
    }
  }

  public getNotificationTypeText(notificationType: NotificationType): string {
    switch (notificationType) {
      case NotificationType.LowBattery:
        return 'NOTIFICATION.LOW_BATTERY';
      case NotificationType.PanicButton:
        return 'NOTIFICATION.PANIC_BUTTON';
      case NotificationType.Text:
        return 'NOTIFICATION.NOTIFICATION';
      default:
        return '';
    }
  }

  private onNotificationsChangeHandler() {
    const notifications$ = this.notificationsService.notifications$.subscribe(
      notifications => {
        this.batteryNotificationsTableDataSource = new MatTableDataSource(
          notifications
        );
        this.batteryNotificationsTableDataSource.sort = this.matSortRef;

        if (notifications.length) {
          this.isFetchingNotifications = false;
        } else {
          setTimeout(() => {
            this.isFetchingNotifications = false;
          }, 5000);
        }
      }
    );
    this.subscriptions.push(notifications$);
  }
}
