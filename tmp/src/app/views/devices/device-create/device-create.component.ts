import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import { DevicesService } from 'src/app/services/factories/devices.service';
import { ListHandlerService } from 'src/app/services/list-handler/list-handler.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ApplicationItem } from '../../../model/applications-interfaces';

@Component({
  selector: 'app-device-create',
  templateUrl: './device-create.component.html',
  styleUrls: ['./device-create.component.scss'],
})
export class DeviceCreateComponent implements OnInit {
  public applicationList: ApplicationItem[] = [];

  public isLoadingApplications = false;

  private text: any = {};

  constructor(
    private loggingService: LoggingService,
    private listHandler: ListHandlerService,
    private applicationService: ApplicationsService,
    private deviceFactory: DevicesService,
    private location: Location,
    private alertService: AlertModalService,
    private translate: TranslateService,
  ) {
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.DEVICE_EXIST')
      .pipe(take(1))
      .subscribe(a => {
        this.text.deviceExist = a;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.500')
      .pipe(take(1))
      .subscribe(b => {
        this.text.deviceError = b;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.200')
      .pipe(take(1))
      .subscribe(h => {
        this.text.deviceSuccess = h;
      });
  }

  ngOnInit(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para app/devices/create',
    );

    this.getApplications();
  }

  getApplications() {
    this.isLoadingApplications = true;
    this.applicationService
      .listApplicationsAvailableForUser()
      .then((applications: ApplicationItem[]) => {
        this.applicationList = this.listHandler.alphabeticalOrder(
          applications.filter(a => a.allowDeviceAssociation),
        );
      })
      .catch(error =>
        this.loggingService.logException(error, SeverityLevel.Warning),
      )
      .finally(() => {
        this.isLoadingApplications = false;
      });
  }

  handleApiErrors(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        this.loggingService.logException(error, SeverityLevel.Warning);
        this.alertService.showAlertDanger(this.text.deviceExist, '');
        break;
      case 500:
        this.loggingService.logException(error, SeverityLevel.Warning);
        this.alertService.showAlertDanger(this.text.deviceExist, '');
        break;
      default:
        this.loggingService.logException(error, SeverityLevel.Warning);
        this.alertService.showAlertDanger(this.text.deviceError, '');
        break;
    }
  }

  addDevice(body) {
    this.deviceFactory.create(body, body.applicationId).subscribe(
      () => {
        this.loggingService.logEventWithUserInfo('Portal TM - Criou um device');
        this.alertService.showAlertSuccess(this.text.deviceSuccess, '');
        this.location.back();
      },
      error => {
        this.handleApiErrors(error);
      },
    );
  }
}
