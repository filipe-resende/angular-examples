import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { tap, take, skip, filter, pairwise } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { BatteryState } from '../../shared/enums/batteryState';
import { Site } from '../../shared/models/site';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';
import { DevicesService } from '../../stores/devices/devices.service';
import { DeviceModel } from '../../stores/devices/devices.state';
import Application from '../../shared/models/application';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import { SitesService } from '../../stores/sites/sites.service';
import { NotificationService } from '../../components/presentational/notification';
import { ExcelService } from '../../core/services/excel-service/excel.service';
import { OverlayService } from '../../core/services/overlay.service';
import { OverlayExporterComponent } from '../../components/presentational/overlay-exporter/overlay-exporter.component';
import { HttpStatusCodes } from '../../core/constants/http-status-codes.enum';
import { ModalStatusComponent } from '../../components/presentational/modal-status/modal-status.component';
import { UserNotIncludedInDeviceGroup } from '../../core/constants/error';
import { FeatureFlagsStateService } from '../../stores/feature-flags/feature-flags-state.service';
import { FeatureFlags } from '../../core/constants/feature-flags.const';
import { Middlewares } from '../../core/constants/middleware.const';
import { ExportationTypes } from '../../shared/enums/ExportationTypes';
import { Role } from '../../shared/enums/role';
import { getTypeAccess } from '../../shared/utils/location-events-helpers/location-events-helpers';
import { EventTypeLabels } from '../../core/constants/event-type';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';
// eslint-disable-next-line no-shadow
export enum HttpErrorStatus {
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND'
}

interface DefautlTimeRange {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-devices-page',
  templateUrl: 'devices.page.html',
  styleUrls: ['devices.page.scss']
})
export class DevicesPage implements OnInit, OnDestroy {
  public tableColumns: string[] = [
    'deviceType',
    'deviceId',
    'lastReport',
    'lastLocation',
    'thingName',
    'thingDoc',
    'batteryState'
  ];

  private DEVICES_WITH_READER = [
    'SecurityCenterCardAdapter',
    'PortableBadgeAdapter'
  ];

  private READER_NAME = 'readerName';

  private BATTERY_STATE = 'batteryState';

  public tableDataSource: MatTableDataSource<DeviceModel>;

  public devicesForm: FormGroup;

  public skeletonArray = Array(10);

  public selectedSite: Site;

  public ngForm: FormGroup;

  public devices: DeviceModel[] = [];

  public isFetchingFirstDevices: boolean;

  public isFetchingApplications = false;

  public isSearching = false;

  public repeatedErrorsCounter = 0;

  public paginator: Paginator = { page: 1, perPage: 10, total: 0 };

  private subscriptions: Subscription[] = [];

  public get BatteryState(): typeof BatteryState {
    return BatteryState;
  }

  public refreshTimeInfo$: Observable<Date>;

  private exportOverlayRef: OverlayRef;

  public canViewSensitiveData: boolean;

  public hasExportPermission = false;

  public showDeviceGroupDisclaimer = false;

  public EventTypeLabels = EventTypeLabels;

  constructor(
    private devicesService: DevicesService,
    private breadcrumbService: BreadcrumbService,
    private fb: FormBuilder,
    private sitesService: SitesService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private excelService: ExcelService,
    private overlayService: OverlayService,
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
    private featureFlagsStateService: FeatureFlagsStateService
  ) {}

  public ngOnInit(): void {
    this.refreshTimeInfo$ = this.getDevicesRefreshTimeInfo();
    this.devicesForm = this.setupForm();

    this.emptyTable();
    this.setupBreadcrumb();

    this.onChangeDevicesHandler();
    this.setupSitesSub();
    this.setupDeviceNumberFormSub();
    this.setupResponseErrorSub();

    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();

    if (!this.canViewSensitiveData)
      this.tableColumns = this.tableColumns.filter(
        tableColumn => tableColumn !== 'thingDoc'
      );

    if (
      this.userProfileService.canViewSensitiveData() ||
      this.userProfileService.getUserRoles().find(r => r === Role.Facilities)
    ) {
      this.hasExportPermission = true;
    }

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

    this.exportOverlayRef = this.overlayService.create();
  }

  setupResponseErrorSub(): void {
    this.devicesService.httpResponseError$
      .pipe(filter(x => !!x))
      .subscribe(error => {
        this.openStatusModal(error);
      });
    this.devicesService.updateHttpErrorResponse(null);
  }

  openStatusModal(httpErrorResponse: HttpErrorResponse): void {
    if (
      httpErrorResponse?.status === 400 &&
      (httpErrorResponse?.error ?? []).includes(UserNotIncludedInDeviceGroup)
    ) {
      this.dialog.closeAll();

      this.translateService
        .get(`DEVICES.HTTP_ERROR_RESPONSES.DEVICE_GROUP_NOT_FOUND`)
        .subscribe(response => {
          const content: string = response;
          this.dialog.open(ModalStatusComponent, {
            data: {
              content
            }
          });
        });
    }
  }

  getTextDeviceGroupNotFound(): string {
    let textDeviceGroupNotFound: string;
    this.translateService
      .get(`DEVICES.HTTP_ERROR_RESPONSES.DEVICE_GROUP_NOT_FOUND`)
      .subscribe(textResponse => {
        textDeviceGroupNotFound = textResponse;
      });
    return textDeviceGroupNotFound;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.devicesService.clearRequests();
    this.tearDownBreadcrumb();

    this.devicesService.clearDevicesReloadTimer();
    this.devicesService.updateHttpErrorResponse(null);
  }

  public onApplicationSelect(selectedApplication: Application): void {
    const { name, id } = selectedApplication || { name: '', id: '' };

    this.devicesForm.controls.deviceType.patchValue({ name, id });
    this.devicesForm.controls.deviceNumber.patchValue('');

    this.devicesService.updateSelectedApplicationState(
      this.devicesForm.controls.deviceType.value as Application
    );
  }

  public onClearFilters(): void {
    this.devicesForm.reset();
    this.devicesService.clearDeviceFilters();
  }

  public onExportExcel(buttonElementRef: ElementRef<HTMLButtonElement>): void {
    const { startDate, endDate } = this.setDefaultTimeRange();
    const { name: site } = this.selectedSite;
    const { value: deviceType } = this.devicesForm.get('deviceType').get('id');
    const { value: deviceNumber } = this.devicesForm.get('deviceNumber');

    this.overlayService.open<OverlayExporterComponent>(
      this.exportOverlayRef,
      buttonElementRef,
      OverlayExporterComponent,
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 30
      },
      {
        paramsObj: {
          site,
          deviceType,
          periodFrom: startDate,
          periodTo: endDate,
          deviceNumber
        },
        exportCallback:
          this.excelService.exportDevicesAsExcelToLoggedUserEmail.bind(
            this.excelService
          ),
        modalType: ExportationTypes.DevicesPage
      }
    );
  }

  public async onChangePage({ page }: Paginator): Promise<void> {
    this.paginator.page = page;
    this.devicesService.updatePaginatorState(this.paginator);

    await this.search();
  }

  public async onFetchDevices(): Promise<void> {
    this.resetTable();
    await this.search();
    this.updateColumn();
  }

  private async search(): Promise<void> {
    this.isFetchingFirstDevices = true;

    this.devicesService.clearRequests();

    const { startDate: from, endDate: till } = this.setDefaultTimeRange();

    const deviceFormValue = this.devicesForm.value;
    const { id: deviceType } = deviceFormValue.deviceType;
    const { deviceNumber } = deviceFormValue;

    const { page, perPage: pageSize } = this.paginator;

    this.devicesService.fetchNewDevices({
      from,
      till,
      deviceType,
      deviceNumber,
      page,
      pageSize
    });
  }

  private onChangeDevicesHandler(): void {
    const devicesSubscription$ = this.setupDevicesSub();
    const paginator$ = this.setupPaginatorSub();
    const totalCount$ = this.setupTotalCountSub();
    const selectedApplication$ = this.setupSelectedApplicationSub();
    const httpErrorResponse$ = this.setupHttpResponseSub();
    const deviceNumberFilter$ = this.setupDeviceNumberFilterSub();

    this.subscriptions.push(
      devicesSubscription$,
      paginator$,
      totalCount$,
      selectedApplication$,
      httpErrorResponse$,
      deviceNumberFilter$
    );
  }

  private emptyTable(): void {
    const emptyArray = Array(10);

    this.tableDataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        deviceType: null,
        deviceId: null,
        thingName: null,
        thingDoc: null,
        batteryState: null,
        lastLocation: null,
        readerName: null,
        lastReport: null,
        licensePlate: null,
        eventDirection: null,
        eventType: null,
        telemetryName: null
      }))
    );
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/devices',
      text: 'BREADCRUMB.DEVICES'
    });
  }

  private tearDownBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(false);
    this.breadcrumbService.popBreadcrumbItem();
  }

  private handleHttpResponseErrors({ status }: HttpErrorResponse): void {
    switch (status) {
      case HttpStatusCodes.Forbidden:
        this.getTranslatedResource(HttpErrorStatus.FORBIDDEN).subscribe(
          message => this.callNotificationWarning(message)
        );
        break;

      case HttpStatusCodes.NotFound:
        this.getTranslatedResource(HttpErrorStatus.NOT_FOUND).subscribe(
          message => this.callNotificationWarning(message)
        );
        this.devicesService.clearDevicesTable();
        break;
    }
  }

  private getDevicesRefreshTimeInfo(): Observable<Date> {
    return this.devicesService.refreshTimeInfo$.pipe(
      filter((lastUpdate: Date) => !!lastUpdate)
    );
  }

  private getTranslatedResource(reference: string): Observable<string> {
    return this.translateService
      .get(`DEVICES.HTTP_ERROR_RESPONSES.${reference}`)
      .pipe(take(1));
  }

  private callNotificationWarning(message: string): void {
    this.notificationService.warning(message, false, 3000);
  }

  private setupForm(): FormGroup {
    return this.fb.group({
      deviceType: this.fb.group({
        id: ['', Validators.required],
        name: ['', Validators.required]
      }),
      deviceNumber: ['', Validators.required]
    });
  }

  private setDefaultTimeRange(): DefautlTimeRange {
    const startDate = moment.utc().subtract(1, 'day').format();
    const endDate = moment.utc().format();

    return { startDate, endDate };
  }

  private resetTable(): void {
    this.devicesService.clearRequests();
    this.paginator.page = 1;
    this.devicesService.updateDevicesTablePaginator(this.paginator);
  }

  private setupDevicesSub(): Subscription {
    return this.devicesService.devices$
      .pipe(
        tap(() => {
          this.isFetchingFirstDevices = false;
        })
      )
      .subscribe(devices => {
        if (devices.length) {
          const devicesMapped = devices.map(device => {
            const deviceType =
              device.deviceType === Middlewares.BusEventAdapter
                ? 'DEVICES_SELECTOR.BUS'
                : device.deviceType;
            const typeAccess = getTypeAccess(device);

            return {
              ...device,
              deviceType,
              typeAccess
            };
          });

          this.tableDataSource = new MatTableDataSource(devicesMapped);
          this.devicesService.updateHttpErrorResponse(null);
        } else {
          this.emptyTable();
        }
      });
  }

  private setupPaginatorSub(): Subscription {
    return this.devicesService.devicesTablePaginator$.subscribe(
      ({ page }: Paginator) => {
        this.paginator.page = page;
      }
    );
  }

  private setupTotalCountSub(): Subscription {
    return this.devicesService.totalCount$.subscribe((totalCount: number) => {
      this.paginator.total = totalCount;
    });
  }

  private setupSelectedApplicationSub(): Subscription {
    return this.devicesService.selectedApplication$.subscribe(
      (application: Application) => {
        this.devicesForm.controls.deviceType.patchValue(application);
      }
    );
  }

  private setupHttpResponseSub(): Subscription {
    return this.devicesService.httpResponseError$
      .pipe(
        pairwise(),
        filter(([prevError]) => !prevError)
      )
      .subscribe(([, currErr]) => {
        this.handleHttpResponseErrors(currErr);
      });
  }

  private setupDeviceNumberFilterSub(): Subscription {
    return this.devicesService.deviceNumber$
      .pipe(filter(val => !!val))
      .subscribe(deviceNumber => {
        this.devicesForm.controls.deviceNumber.patchValue(deviceNumber);
      });
  }

  private setupDeviceNumberFormSub(): void {
    const deviceNumberSub =
      this.devicesForm.controls.deviceNumber.valueChanges.subscribe(
        (deviceNumber: string) => {
          this.devicesService.updateDeviceNumberFilter(deviceNumber);
        }
      );

    this.subscriptions.push(deviceNumberSub);
  }

  private updateColumn(): void {
    if (
      this.DEVICES_WITH_READER.includes(
        this.devicesForm.controls.deviceType.value.id
      )
    ) {
      if (!this.tableColumns.includes(this.READER_NAME)) {
        this.tableColumns.splice(2, 0, this.READER_NAME);
      }
      this.tableColumns = this.tableColumns.filter(
        item => item !== this.BATTERY_STATE
      );
    } else {
      this.tableColumns = this.tableColumns.filter(
        item => item !== this.READER_NAME
      );

      if (!this.tableColumns.includes(this.BATTERY_STATE)) {
        this.tableColumns.splice(6, 0, this.BATTERY_STATE);
      }
    }
  }

  private setupSitesSub(): void {
    const sites$ = this.sitesService.selectedSite$
      .pipe(
        tap(site => {
          this.selectedSite = site;
        }),
        skip(1)
      )
      .subscribe(site => {
        if (this.devicesForm.controls.deviceType.value.id && site.id) {
          this.resetTable();
          this.search();
        }
      });
    this.subscriptions.push(sites$);
  }
}
