/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceLoadHistory } from 'src/app/model/device-load-history-interface';
import { DeviceLoadHistoryRequest } from 'src/app/model/device-load-history-request';
import { ApplicationId } from 'src/app/core/constants/applicationsId.const';
import { DeviceHistoryLoadService } from 'src/app/services/device-history-load/device-history-load.service';
import { StatusLoadEnum } from 'src/app/shared/enums/statusLoad.enums';
import { formatDate } from '@angular/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { dateNow } from '@microsoft/applicationinsights-core-js';
import $ from 'jquery';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExportationRecipientModalComponent } from 'src/app/components/exportation-recipient-modal/exportation-recipient-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExportationDoneModalComponent } from 'src/app/components/exportation-done-modal/exportation-done-modal.component';
import { IamRolesEnum } from 'src/app/shared/enums/iam.enums';
import { AuditLogService } from '../../services/audit-log/audit-log.service';

@Component({
  selector: 'app-history-load',
  templateUrl: './history-load.component.html',
  styleUrls: ['./history-load.component.scss'],
})
export class HistoryLoadComponent implements AfterViewInit {
  public displayedColumns: string[] = [
    'loadType',
    'applicationId',
    'management',
    'sapPlant',
    'managerGroup',
    'groupName',
    'invoiceVale',
    'invoiceProvider',
    'calledCode',
    'moveDate',
    'numberOfLoadedDevices',
    'chargeStatus',
    'uploadFileName',
    'uploadDate',
    'logFile',
  ];

  public deviceHistoryRequest: DeviceLoadHistoryRequest = {
    applicationId: null,
    calledCode: null,
    groupName: null,
    invoiceProvider: null,
    invoiceVale: null,
    loadType: null,
    managerGroup: null,
    sapPlant: null,
    moveDate: null,
    uploadEndDate: null,
    uploadFirstDate: null,
  };

  public maxDate = new Date();

  public url = '?';

  public skip = 0;

  public count = null;

  public deviceStatus = StatusLoadEnum;

  public applicationId = ApplicationId;

  public data = new MatTableDataSource<DeviceLoadHistory>([]);

  public paginatorShow = false;

  public lastMonthDate = new Date(dateNow());

  public exportUrl: string;

  private utcValueBR = -3;

  public spinner = false;

  public notFound = false;

  private dialogConfig = new MatDialogConfig();

  private emailUser: string;

  public roleUser: any;

  constructor(
    private translate: TranslateService,
    private liveAnnouncer: LiveAnnouncer,
    private deviceHistoryLoadService: DeviceHistoryLoadService,
    private auditLogService: AuditLogService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.lastMonthDate.setDate(this.lastMonthDate.getDate() - 30);
    this.emailUser = this.authService.getUserInfo().mail;
    this.roleUser = this.authService.getUserInfo().role;
  }

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public ngAfterViewInit() {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  private constructorUrl(): void {
    if (this.deviceHistoryRequest.loadType != null)
      this.url += `LoadType=${this.deviceHistoryRequest.loadType}&`;

    if (this.deviceHistoryRequest.applicationId != null)
      this.url += `ApplicationId=${this.deviceHistoryRequest.applicationId}&`;

    if (this.deviceHistoryRequest.groupName != null)
      this.url += `GroupName=${this.deviceHistoryRequest.groupName}&`;

    if (this.deviceHistoryRequest.sapPlant != null)
      this.url += `SapPlant=${this.deviceHistoryRequest.sapPlant}&`;

    if (this.deviceHistoryRequest.calledCode != null)
      this.url += `CalledCode=${this.deviceHistoryRequest.calledCode}&`;

    if (this.deviceHistoryRequest.uploadFirstDate != null)
      this.url += `UploadFirstDate=${formatDate(
        this.deviceHistoryRequest.uploadFirstDate,
        'yyyy/MM/dd',
        'pt',
      )}&`;

    if (this.deviceHistoryRequest.uploadEndDate != null)
      this.url += `UploadEndDate=${formatDate(
        this.deviceHistoryRequest.uploadEndDate,
        'yyyy/MM/dd',
        'pt',
      )}&`;

    if (this.deviceHistoryRequest.invoiceProvider != null)
      this.url += `InvoiceProvider=${this.deviceHistoryRequest.invoiceProvider}&`;

    if (this.deviceHistoryRequest.invoiceVale != null)
      this.url += `InvoiceVale=${this.deviceHistoryRequest.invoiceVale}&`;

    if (this.deviceHistoryRequest.managerGroup != null)
      this.url += `managerGroup=${this.deviceHistoryRequest.managerGroup}&`;

    if (this.deviceHistoryRequest.moveDate != null)
      this.url += `MoveDate=${formatDate(
        this.deviceHistoryRequest.moveDate,
        'yyyy/MM/dd',
        'pt',
      )}&`;

    if (this.deviceHistoryRequest.managerGroup != null)
      this.url += `ManagerGroup=${this.deviceHistoryRequest.managerGroup}&`;
  }

  public search() {
    this.constructorUrl();
    if (this.skip != null) this.url += `skip=${this.skip}&`;

    if (this.count != null) this.url += `count=${this.count}`;

    this.spinner = true;
    this.deviceHistoryLoadService.getByDeviceHistoryLoad(this.url).subscribe(
      data => {
        this.paginatorShow = true;
        this.data = new MatTableDataSource<DeviceLoadHistory>(
          data.devicesLoadHistory,
        );
        this.data.sort = this.sort;
        this.data.paginator = this.paginator;
        this.exportUrl = this.url;
        this.spinner = false;
        this.url = '?';

        if (this.data.data.length === 0) {
          this.notFoundView();
        }
      },
      () => {
        this.data = new MatTableDataSource<DeviceLoadHistory>();
        this.data.sort = this.sort;
        this.data.paginator = this.paginator;
        this.spinner = false;
        this.url = '?';
        this.notFoundView();
      },
    );
  }

  public notFoundView() {
    this.notFound = true;
    setTimeout(() => {
      this.notFound = false;
    }, 3000);
  }

  public clearFilter() {
    this.deviceHistoryRequest = {
      applicationId: null,
      calledCode: null,
      groupName: null,
      invoiceProvider: null,
      invoiceVale: null,
      loadType: null,
      managerGroup: null,
      sapPlant: null,
      moveDate: null,
      uploadEndDate: null,
      uploadFirstDate: null,
    };
    this.data = new MatTableDataSource<DeviceLoadHistory>();
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
    this.paginatorShow = false;
    this.url = '?';
    $('#applicationIdSelect').prop('selectedIndex', 0);
    $('#loadTypeSelect').prop('selectedIndex', 0);
  }

  public selectApplicationId(event: Event) {
    this.deviceHistoryRequest.applicationId = (event.target as HTMLSelectElement).value;
  }

  public selectLoadType(event: Event) {
    this.deviceHistoryRequest.loadType = parseInt(
      (event.target as HTMLSelectElement).value,
      10,
    );
  }

  public validatorDateLog(date: string): boolean {
    if (date >= this.lastMonthDate.toISOString()) {
      return true;
    }
    return false;
  }

  public changeDateToUTCLocal(date: string) {
    const utc = new Date(date);
    return utc.toLocaleString();
  }

  public downloadFileLog(email: string, date: Date, numberVSC: string) {
    this.auditLogService.getLoadLogByUserEmailAndDateTime(
      email,
      date,
      numberVSC,
    );
  }

  public export() {
    this.dialogConfig.id = 'app-exportation-recipient-modal';
    const dialogRef = this.dialog.open(ExportationRecipientModalComponent, {
      data: {
        recipientEmailAddress: this.emailUser,
      },
    });
    dialogRef.componentInstance.send.subscribe(() => {
      this.deviceHistoryLoadService
        .sendFileToMail(this.exportUrl, this.emailUser)
        .subscribe();
      this.dialogConfig.id = 'app-exportation-done-modal';
      this.dialog.open(ExportationDoneModalComponent);
    });
  }

  public validatorRole(): boolean {
    if (
      this.roleUser === IamRolesEnum.admin ||
      this.roleUser === IamRolesEnum.euc ||
      this.roleUser === IamRolesEnum.analistasegempresarial
    ) {
      return true;
    }
    return false;
  }
}
