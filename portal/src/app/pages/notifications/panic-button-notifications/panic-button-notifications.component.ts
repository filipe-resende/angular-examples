import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../../../shared/enums/notificationType';
import { NotificationsService } from '../../../stores/notifications/notifications.service';
import { CachePanicAlert } from '../../../stores/panic-alert/panic-alert.state';
import { PanicAlertAnswerCallOverlay } from '../../../components/smart/panic-alert/panic-alert-answer-call-overlay/panic-alert-answer-call-overlay.component';
import { PanicAlertNotification } from '../../../shared/models/notification';
import { PanicAlertAttendanceDetailsOverlay } from '../../../components/smart/panic-alert/panic-alert-attendance-details-overlay/panic-alert-attendance-details-overlay.component';
import { NotificationStatus } from '../../../shared/enums/notificationStatus';
import { UserNotIncludedInDeviceGroup } from '../../../core/constants/error';
import { ModalStatusComponent } from '../../../components/presentational/modal-status/modal-status.component';
import { MapApplicationIdToMiddleware } from '../../../core/constants/application-to-middleware';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-panic-button-notifications',
  templateUrl: './panic-button-notifications.component.html',
  styleUrls: ['./panic-button-notifications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanicButtonNotificationsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) public matSortRef: MatSort;

  public tableColumns: string[] = [
    'status',
    'name',
    'company',
    'documentId',
    'iamId',
    'passport',
    'sourceApplicationName',
    'deviceId',
    'lastLocation',
    'lastReport'
  ];

  public ngForm: FormGroup;

  public panicButtonNotificationsTableDataSource: MatTableDataSource<PanicAlertNotification>;

  public skeletonArray = Array(10);

  public isFetchingNotifications = true;

  public total = 0;

  public pageSize = 10;

  public actualPage = 1;

  public notificationStatus: string;

  public notificationStatusOptions = { todo: '', doing: '', done: '' };

  public panicAlertOptions: string[] = [];

  private lastFilter$: Observable<string>;

  private subscriptions: Subscription[] = [];

  public canViewSensitiveData: boolean;

  private defaultFilter = 'Aguardando Atendimento';

  constructor(
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.ngForm = this.fb.group({
      statusSelected: [null, Validators.required]
    });
  }

  public ngOnInit(): void {
    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();
    this.lastFilter$ = this.notificationsService.lastFilterPanicButton$;
    this.ngForm.controls.statusSelected.setValue(this.defaultFilter);
    if (!this.canViewSensitiveData)
      this.tableColumns = this.tableColumns.filter(
        tableColumn => !['documentId', 'passport'].includes(tableColumn)
      );

    this.onPanicButtonNotificationsChangeHandler();
    this.fetchNotificationsAtCurrentPage();
    this.onFilterByStatus();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
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

  public onChangePage({ page, perPage }): void {
    this.isFetchingNotifications = true;
    const status = this.getNotificationStatusEnumValueByFilterOption(
      this.ngForm.get('statusSelected').value
    );
    this.actualPage = page;
    this.notificationsService
      .getPanicButtonNotifications(page, perPage, status)
      .then(({ total }) => {
        this.total = total;
      })
      .catch(error => {
        this.showErrorDialog(error);
      })
      .finally(() => {
        this.isFetchingNotifications = false;
      });
  }

  public onFilterByStatus(actualPage = 1): void {
    this.setupFilterOptions();
    this.actualPage = actualPage;
    const selectedStatus = this.ngForm.get('statusSelected').value;
    this.notificationsService.updateLastFilterButtonPanic(selectedStatus);
    const status =
      this.getNotificationStatusEnumValueByFilterOption(selectedStatus);
    this.isFetchingNotifications = true;

    this.notificationsService
      .getPanicButtonNotifications(this.actualPage, this.pageSize, status)
      .then(({ total }) => {
        this.total = total;
        if (!this.total) this.emptyTable();
      })
      .catch(error => {
        this.emptyTable();
        this.showErrorDialog(error);
      })
      .finally(() => {
        this.isFetchingNotifications = false;
      });
  }

  public onClearPanicButtonNotificationsStatusFilter(): void {
    this.ngForm.get('statusSelected').setValue(null);
    this.isFetchingNotifications = true;
    this.actualPage = 1;
    this.fetchNotificationsAtCurrentPage();
  }

  public onAttendanceCompletedIconClick(
    panicAlertNotification: PanicAlertNotification
  ): void {
    this.dialog.open(PanicAlertAttendanceDetailsOverlay, {
      disableClose: true,
      data: {
        alert: panicAlertNotification,
        attendedBy: panicAlertNotification.attendedBy,
        onClose: () => this.onFilterByStatus(this.actualPage),
        isAttendanceCompleted: true
      }
    });
  }

  public onInAttendanceIconClick(
    panicAlertNotification: PanicAlertNotification
  ): void {
    this.dialog.open(PanicAlertAttendanceDetailsOverlay, {
      disableClose: true,
      data: {
        alert: panicAlertNotification,
        attendedBy: panicAlertNotification.attendedBy,
        onClose: () => this.onFilterByStatus(this.actualPage),
        isAttendanceCompleted: false
      }
    });
  }

  public onWaitingServiceIconClick(
    panicAlertNotification: PanicAlertNotification
  ): void {
    const alert: CachePanicAlert = this.mapPanicAlertNotificationToAlert(
      panicAlertNotification
    );

    this.dialog.open(PanicAlertAnswerCallOverlay, {
      disableClose: true,
      data: {
        alert,
        onClose: () => {
          this.onFilterByStatus(this.actualPage);
        }
      }
    });
  }

  public getMiddlewareName(sourceApplicationId) {
    return MapApplicationIdToMiddleware[sourceApplicationId];
  }

  private getNotificationStatusEnumValueByFilterOption(term: string) {
    switch (term) {
      case this.notificationStatusOptions.doing:
        return NotificationStatus.inAttendence;
      case this.notificationStatusOptions.done:
        return NotificationStatus.attended;
      default:
        return NotificationStatus.waitingService;
    }
  }

  private onPanicButtonNotificationsChangeHandler() {
    const notifications$ =
      this.notificationsService.panicButtonNotifications$.subscribe(
        panicButtonNotifications => {
          this.panicButtonNotificationsTableDataSource = new MatTableDataSource(
            panicButtonNotifications
          );
          this.panicButtonNotificationsTableDataSource.sort = this.matSortRef;
        }
      );

    this.subscriptions.push(notifications$);
  }

  private mapPanicAlertNotificationToAlert(
    panicAlertNotification: PanicAlertNotification
  ) {
    return {
      deviceSourceInfoId: panicAlertNotification.device,
      deviceSourceInfoType: panicAlertNotification.deviceType,
      sourceApplicationId: panicAlertNotification.sourceApplicationId,
      eventLocation: panicAlertNotification.location,
      id: panicAlertNotification.id,

      cacheId: 0,
      eventDateTime: panicAlertNotification.eventDate,
      reason: panicAlertNotification.reason,
      thing: panicAlertNotification.thing,
      areaName: panicAlertNotification.areaName,
      sourceApplicationName: panicAlertNotification.sourceApplicationName
    };
  }

  private fetchNotificationsAtCurrentPage() {
    this.total = 0;

    if (this.userProfileService.doesUserHavePanicAlertPermission()) {
      this.notificationsService
        .getPanicButtonNotifications(this.actualPage, this.pageSize)
        .then(({ total }) => {
          this.total = total;
          if (!total || this.total === 0) this.emptyTable();
        })
        .catch(error => {
          this.emptyTable();
          this.showErrorDialog(error);
        })
        .finally(() => {
          this.isFetchingNotifications = false;
        });
    } else {
      this.isFetchingNotifications = false;
    }
  }

  private setupFilterOptions() {
    this.translate.get('NOTIFICATION.FILTER_BY_STATUS').subscribe(status => {
      this.panicAlertOptions.push(status.TODO, status.DOING, status.DONE);
      this.notificationStatusOptions = {
        todo: status.TODO,
        doing: status.DOING,
        done: status.DONE
      };
    });
  }

  public showErrorDialog(error: HttpErrorResponse) {
    let content;

    if (
      error?.status === 400 &&
      (error?.error ?? []).includes(UserNotIncludedInDeviceGroup)
    ) {
      this.translate
        .get(`DEVICES.HTTP_ERROR_RESPONSES.DEVICE_GROUP_NOT_FOUND`)
        .subscribe(response => {
          content = response;
        });
    } else {
      this.translate
        .get(`DEVICES.HTTP_ERROR_RESPONSES.SERVER_ERROR`)
        .subscribe(response => {
          content = response;
        });
    }
    this.dialog.closeAll();
    this.dialog.open(ModalStatusComponent, {
      data: {
        content
      }
    });
  }

  private emptyTable() {
    this.panicButtonNotificationsTableDataSource = null;
    this.isFetchingNotifications = false;
    this.actualPage = 1;

    const emptyArray = Array(10);

    this.panicButtonNotificationsTableDataSource = new MatTableDataSource(
      emptyArray.fill('').map(el => ({
        type: null,
        eventDate: null,
        description: null,
        id: null,
        seen: null,
        totalSent: null,
        text: null,
        device: null,
        deviceType: null,
        batteryState: null,
        location: {
          lat: null,
          lng: null
        },
        sourceApplicationId: null,
        sourceApplicationName: null,
        status: null,
        reason: null,
        thing: null,
        areaName: null
      }))
    );
  }
}
