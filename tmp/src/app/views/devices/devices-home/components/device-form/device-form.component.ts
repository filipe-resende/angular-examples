import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { LoggingService } from 'src/app/services/logging/logging.service';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { SapPlantService } from 'src/app/services/factories/sap-plant.service';
import { Observable } from 'rxjs';
import { SapPlant } from 'src/app/model/sap-plant-interfaces';

interface TextMessages {
  nameEmpty: string;
  descriptionEmpty: string;
  typeEmpty: string;
  numberEmpty: string;
  invalidStatus: string;
}

@Component({
  selector: 'app-device-form',
  templateUrl: 'device-form.component.html',
  styleUrls: ['device-form.component.scss'],
})
export class DeviceFormComponent implements OnInit {
  @Input() deviceData;

  @Input() application: ApplicationItem;

  @Output() onSubmit = new EventEmitter();

  @Input() canUserEditDevice = false;

  canDeviceBeEdited = false;

  public disabled = false;

  public formData;

  private text: TextMessages = {
    nameEmpty: '',
    descriptionEmpty: '',
    typeEmpty: '',
    numberEmpty: '',
    invalidStatus: '',
  };

  public rfId;

  public groupName = '';

  public managementName = '';

  public deviceManager = '';

  public sourceValueRfId = '';

  public isShowRfId = true;

  public sourceValueDevice: string;

  public sourceTypeDevice: string;

  public name: string;

  public sourceInfosList = [{ type: '', value: '' }];

  public type = '';

  public value = '';

  public showDisclaimer = false;

  public sapPlant$: Observable<SapPlant>;

  public sapPlant = '';

  constructor(
    private loggingService: LoggingService,
    private alertService: AlertModalService,
    private translate: TranslateService,
    private sapPlantService: SapPlantService,
  ) {}

  ngOnInit(): void {
    this.formData = this.deviceData;

    if (this.deviceData.sapPlantId != null) {
      this.sapPlant$ = this.sapPlantService.getSapPlantById(
        this.deviceData.sapPlantId,
      );
      this.sapPlant$.subscribe((sapPlant: SapPlant) => {
        this.sapPlant = `${sapPlant.code} - ${sapPlant.description}`;
      });
    }

    const rfIdObj = this.formData.sourceInfos?.find(
      rfid => rfid.type === 'rfId',
    );

    if (rfIdObj) {
      this.rfId = rfIdObj.value;
    }

    if (this.formData.group) {
      this.groupName = this.formData.group.name;
      this.deviceManager = this.formData.group.managerEmail;
    }

    if (this.formData.management) {
      this.managementName = this.formData.management.description;
    }

    this.checkApplicationId(this.formData.applicationId);
    this.canDeviceBeEdited = this.application.allowDeviceAssociation;
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.NAME_EMPTY')
      .subscribe(d => {
        this.text.nameEmpty = d;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.DESCRIPTION_EMPTY')
      .subscribe(e => {
        this.text.descriptionEmpty = e;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.TYPE_EMPTY')
      .subscribe(f => {
        this.text.typeEmpty = f;
      });
    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.NUMBER_EMPTY')
      .subscribe(g => {
        this.text.numberEmpty = g;
      });

    this.translate
      .get('DEVICE_CREATE.SAVE_RESPONSE.INVALID_STATUS')
      .subscribe(message => {
        this.text.invalidStatus = message;
      });
  }

  checkApplicationId(applicationId) {
    switch (applicationId) {
      case '847932a4-959b-4e7a-bd0a-f3408f84f088':
        this.sourceTypeDevice = 'deviceId';
        this.isShowRfId = false;
        break;
      case '70bdbce7-7d27-4e4c-8c5c-cd12a57902a4':
        this.sourceTypeDevice = 'deviceId';
        this.isShowRfId = false;
        break;
      default:
        this.isShowRfId = true;
        break;
    }
  }

  formUpdateValidation(deviceToBeUpdated): boolean {
    if (!deviceToBeUpdated.name) {
      this.loggingService.logException(
        new Error('Tentou editar um device sem informar um nome'),
        SeverityLevel.Information,
      );
      this.alertService.showAlertDanger(this.text.nameEmpty);
      this.disabled = false;
      return false;
    }

    if (!deviceToBeUpdated.sourceInfos[0].type) {
      this.loggingService.logException(
        new Error('Tentou editar um device sem informar um source type'),
        SeverityLevel.Information,
      );
      this.alertService.showAlertDanger(this.text.typeEmpty, '');
      this.disabled = false;
      return false;
    }

    if (!deviceToBeUpdated.sourceInfos[0].value) {
      this.loggingService.logException(
        new Error('Tentou editar um device sem informar um source ID'),
        SeverityLevel.Information,
      );
      this.alertService.showAlertDanger(this.text.numberEmpty, '');
      this.disabled = false;
      return false;
    }
    return true;
  }

  handleSaveButton() {
    this.disabled = true;

    setTimeout(() => {
      this.disabled = false;
    }, 1000);

    if (!this.formUpdateValidation(this.formData)) {
      return;
    }

    const newSourceInfos = [];

    const deviceId = this.formData.sourceInfos.find(
      source => source.type === 'deviceId',
    );

    if (deviceId) {
      newSourceInfos.push(deviceId);
    }

    if (this.rfId && this.rfId.length > 0) {
      newSourceInfos.push({
        type: 'rfId',
        value: this.rfId,
      });
    }

    this.formData.sourceInfos = newSourceInfos;

    this.onSubmit.emit(this.formData);
  }
}
