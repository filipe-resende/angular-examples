/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { ApplicationsIds } from 'src/app/core/constants/applications.const';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { LoggingService } from 'src/app/services/logging/logging.service';

@Component({
  selector: 'app-dc-form',
  templateUrl: 'dc-form.component.html',
  styleUrls: ['dc-form.component.scss'],
})
export class DC_FormComponent {
  @Input() applicationList: any;

  @Output() onSubmit = new EventEmitter();

  public applicationId: string;

  public name: string;

  public sourceInfos = [{ type: '', value: '' }];

  public rfId: string;

  public isShowRfId = true;

  public disabled = false;

  private text: any = {};

  public deviceType = false;

  private hasDeviceIdPattern = false;

  public sourceValueRfId: string;

  public sourceValueDevice: string;

  public sourceTypeDevice: string;

  constructor(
    private loggingService: LoggingService,
    private alertService: AlertModalService,
    private translate: TranslateService,
  ) {
    this.translate
      .get('DEVICE_CREATE.APPLICATION_DROPDOWN')
      .pipe(take(1))
      .subscribe(ad => {
        this.text.applicationDropdown = ad;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.NAME_EMPTY')
      .pipe(take(1))
      .subscribe(d => {
        this.text.nameEmpty = d;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.DESCRIPTION_EMPTY')
      .pipe(take(1))
      .subscribe(e => {
        this.text.descriptionEmpty = e;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.TYPE_EMPTY')
      .pipe(take(1))
      .subscribe(f => {
        this.text.typeEmpty = f;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.NUMBER_EMPTY')
      .pipe(take(1))
      .subscribe(g => {
        this.text.numberEmpty = g;
      });
  }

  checkIsDeviceId(event) {
    switch (event.target.value) {
      case '00394bd8-6e75-4465-957a-b10eb8612b81':
        this.sourceTypeDevice = 'deviceUuid';
        this.deviceType = true;
        this.hasDeviceIdPattern = true;
        this.isShowRfId = true;
        break;
      case '847932a4-959b-4e7a-bd0a-f3408f84f088':
        this.sourceTypeDevice = 'deviceId';
        this.deviceType = true;
        this.hasDeviceIdPattern = true;
        this.isShowRfId = false;
        break;
      case '70bdbce7-7d27-4e4c-8c5c-cd12a57902a4':
        this.sourceTypeDevice = 'deviceId';
        this.deviceType = true;
        this.hasDeviceIdPattern = true;
        this.isShowRfId = false;
        break;
      case ApplicationsIds.SecurityCenter:
        this.sourceTypeDevice = 'cardId';
        this.deviceType = true;
        this.hasDeviceIdPattern = true;
        this.isShowRfId = true;
        break;
      case '1b15997c-216b-491a-86a3-abf74d42ccdd':
        this.sourceTypeDevice = 'deviceId';
        this.deviceType = true;
        this.hasDeviceIdPattern = true;
        this.isShowRfId = true;
        break;
      default:
        this.sourceTypeDevice = this.sourceInfos[0].type;
        this.deviceType = false;
        this.hasDeviceIdPattern = false;
        this.isShowRfId = true;
    }
  }

  formCreateValidation(device): boolean {
    if (!device.applicationId) {
      this.alertService.showAlertDanger(this.text.applicationDropdown, '');
      this.loggingService.logException(
        new Error('Tentou criar um device sem selecionar uma aplicação'),
        SeverityLevel.Information,
      );
      this.disabled = true;
      return false;
    }

    if (!device.name) {
      this.alertService.showAlertDanger(this.text.nameEmpty, '');
      this.loggingService.logException(
        new Error('Tentou criar um device sem informar um nome'),
        SeverityLevel.Information,
      );
      this.disabled = false;
      return false;
    }

    if (!this.sourceTypeDevice) {
      this.alertService.showAlertDanger(this.text.typeEmpty, '');
      this.loggingService.logException(
        new Error('Tentou criar um device sem informar um source type'),
        SeverityLevel.Information,
      );
      this.disabled = false;
      return false;
    }

    if (!device.value) {
      this.alertService.showAlertDanger(this.text.numberEmpty, '');
      this.loggingService.logException(
        new Error('Tentou criar um device sem informar um source value'),
        SeverityLevel.Information,
      );
      this.disabled = false;
      return false;
    }
    return true;
  }

  createObject() {
    const deviceToBeCreated: any = {
      name: this.name,
      applicationId: this.applicationId,
    };

    const sourceInfos = [];

    this.sourceValueDevice &&
      sourceInfos.push({
        type: this.sourceTypeDevice,
        value: this.sourceValueDevice,
      });
    this.sourceValueRfId &&
      sourceInfos.push({ type: 'rfId', value: this.sourceValueRfId });

    deviceToBeCreated.sourceInfos = sourceInfos;
    return deviceToBeCreated;
  }

  submit(event, data: any): void {
    this.disabled = true;

    setTimeout(() => {
      this.disabled = false;
    }, 1000);

    event.stopPropagation();
    data.applicationId = this.applicationId;

    if (!this.formCreateValidation(data)) {
      this.disabled = false;
      return;
    }

    const body = this.createObject();
    this.onSubmit.emit(body);
  }
}
