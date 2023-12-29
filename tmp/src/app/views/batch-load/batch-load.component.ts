import { CreateGroup } from 'src/app/model/device-group-management/create-group-interface';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { SapPlantAll } from 'src/app/model/sap-plant-interfaces';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import { SapPlantService } from 'src/app/services/factories/sap-plant.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ManagementNameService } from 'src/app/services/management-name/management-name.service';
import { ExportationDoneModalComponent } from 'src/app/components/exportation-done-modal/exportation-done-modal.component';
import { ExportationRecipientModalComponent } from 'src/app/components/exportation-recipient-modal/exportation-recipient-modal.component';
import { ImportDevices } from 'src/app/model/import-devices-interface';
import { DevicesService } from 'src/app/services/factories/devices.service';
import { ApplicationId } from 'src/app/core/constants/applicationsId.const';
import { StatusLoadEnum } from 'src/app/shared/enums/statusLoad.enums';
import { WantCreateModalComponent } from 'src/app/components/want-create-modal/want-create-modal.component';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { GroupManagementService } from 'src/app/services/factories/group-management.service';
import { ManagerDeviceGroup } from 'src/app/model/manager-device-group-interface';
import { ApplicationsName } from 'src/app/core/constants/applicationsName.const';
import { ImportDevicesValidation } from 'src/app/model/import-devices-validation';
import {
  Management,
  ManagementNameResponse,
} from '../../model/management-name-interfaces';
import { BatchLoadReplaceFileComponent } from './batch-load-replace-file/batch-load-replace-file.component';
import { BatchLoadExportLoadLogComponent } from './batch-load-export-load-log/batch-load-export-load-log.component';
import { BatchLoadExecutionErrorComponent } from './batch-load-execution-error/batch-load-execution-error.component';
import { BatchLoadPlantSapComponent } from './batch-load-plant-sap/batch-load-plant-sap.component';
import { BatchLoadExecutionComponent } from './batch-load-execution/batch-load-execution.component';

@Component({
  selector: 'app-batch-load',
  templateUrl: './batch-load.component.html',
  styleUrls: ['./batch-load.component.scss'],
})
export class BatchLoadComponent implements OnInit {
  @ViewChild('file') fileInput: any;

  public importDevice: ImportDevices = {
    email: null,
    deviceType: null,
    deviceStatusLoad: null,
    moveDate: null,
    invoiceProvider: null,
    invoiceVale: null,
    sapPlant: null,
    emailDeviceManager: null,
    calledCode: null,
    importFileBase64: null,
    fileName: null,
    managementId: null,
    groupName: null,
    groupId: null,
  };

  private groupDataByName: ManagerDeviceGroup = {
    groupId: null,
    thingId: null,
    managerName: null,
    groupManagementId: null,
    groupManagerEmail: null,
    groupName: null,
    createdAt: null,
    deviceCount: null,
    memberCount: null,
    canEdit: false,
  };

  public maxDate = new Date();

  public application = ApplicationId;

  public base64: string;

  public selectedTypeDevice: any;

  public selectLoadType: any;

  public moveDate: any;

  public selectedDeviceGroup: any;

  public groupName = '';

  public groupNameId = '';

  public management = '';

  public managerEmail = '';

  public sapPlant = '';

  public sapPlantId = '';

  public calledCode = '';

  public invoice = '';

  public invoiceProvider = '';

  public sapPlantValidatorView = false;

  public managerEmailValidatorView = false;

  public groupNameShowAlertView: boolean;

  public isLoadingGroup = false;

  public checkTheFieldRequiredNameGroup: boolean;

  public fileData: any;

  public batchSuccess: boolean;

  public typeBatchLoadEnum = StatusLoadEnum;

  public dataSapPlant: SapPlantAll;

  public filterDataSapPlants = [];

  public applications: ApplicationItem[] = [];

  public LIST_TYPE_BATCH_LOAD_SPOT: any[] = [];

  public LIST_TYPE_BATCH_LOAD_SMART: any[] = [];

  private text: any = {};

  public enableExport: boolean;

  private modalConfirmLoad:
    | MatDialogRef<BatchLoadExecutionComponent, any>
    | undefined;

  private modalReplaceFile:
    | MatDialogRef<BatchLoadReplaceFileComponent, any>
    | undefined;

  private modalCreateSAP:
    | MatDialogRef<BatchLoadPlantSapComponent, any>
    | undefined;

  private modalWantCreate:
    | MatDialogRef<WantCreateModalComponent, any>
    | undefined;

  public enableButton = false;

  public sapPlantValue;

  public sapPlantLoading;

  public managementNameLoading;

  public dataManagementName: ManagementNameResponse;

  public filterDataManagementName: Management[] = [];

  public managementNameId = null;

  public managementNameValidatorView = false;

  public errorMessage = '';

  public loadingPage = false;

  public verifyTypeBatchLoad = false;

  LIST_TYPE_SHIPPING_RUN_LOAD: StatusLoadEnum[];

  @Inject(MAT_DIALOG_DATA)
  public data: {
    sapPlantName: any;
    dataSapPlant: SapPlantAll;
    management: any;
    dataManagementName: ManagementNameResponse;
    typeBatchLoad: boolean;
  };

  constructor(
    public sapPlantService: SapPlantService,
    public managementService: ManagementNameService,
    public matDialog: MatDialog,
    private translate: TranslateService,
    private applicationService: ApplicationsService,
    private authService: AuthService,
    private auditLogService: AuditLogService,
    private devicesService: DevicesService,
    private groupManagementService: GroupManagementService,
    private alertService: AlertModalService,
  ) {
    this.setTypeBatchLoad();
    this.sapPlantDisplay();
    this.managementNameDisplay();
  }

  private setTypeBatchLoad(): void {
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.ACQUISITION')
      .pipe(take(1))
      .subscribe(a => {
        this.text.acquisition = a;
      });
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.LICENSE_ACTIVATION')
      .pipe(take(1))
      .subscribe(b => {
        this.text.licenseActivation = b;
      });
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.DISCARD')
      .pipe(take(1))
      .subscribe(c => {
        this.text.discard = c;
      });
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.DEVOLUTION')
      .pipe(take(1))
      .subscribe(d => {
        this.text.devolution = d;
      });
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.LOSS')
      .pipe(take(1))
      .subscribe(e => {
        this.text.loss = e;
      });
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.LOCATION_TRANSFER')
      .pipe(take(1))
      .subscribe(f => {
        this.text.locationTransfer = f;
      });
    this.translate
      .get('BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.PROPERTY_TRANSFER')
      .pipe(take(1))
      .subscribe(g => {
        this.text.propertyTransfer = g;
      });
    this.translate
      .get(
        'BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.SHIPPING_TECHNICAL_ASSISTANCE',
      )
      .pipe(take(1))
      .subscribe(h => {
        this.text.shippingTechnicalAssistance = h;
      });
    this.translate
      .get(
        'BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.RETUNR_TECHNICAL_ASSISTANCE',
      )
      .pipe(take(1))
      .subscribe(h => {
        this.text.returnTechnicalAssistance = h;
      });
    this.translate
      .get(
        'BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.RETUNR_TECHNICAL_ASSISTANCE_NEW',
      )
      .pipe(take(1))
      .subscribe(h => {
        this.text.returnTechnicalAssistanceNew = h;
      });
    this.translate
      .get(
        'BATCH_LOAD_HOME.BATCH_LOAD_SELECT.LOAD_TYPE.RETUNR_TECHNICAL_ASSISTANCE_REPLACED',
      )
      .pipe(take(1))
      .subscribe(h => {
        this.text.returnTechnicalAssistanceReplaced = h;
      });

    this.LIST_TYPE_BATCH_LOAD_SPOT = [
      { id: StatusLoadEnum.Aquisicao, name: this.text.acquisition },
      {
        id: StatusLoadEnum.AtivacaoDeLicenca,
        name: this.text.licenseActivation,
      },
      { id: StatusLoadEnum.Descarte, name: this.text.discard },
      { id: StatusLoadEnum.Devolucao, name: this.text.devolution },
      { id: StatusLoadEnum.Perda, name: this.text.loss },
      {
        id: StatusLoadEnum.TransferenciaDeLocal,
        name: this.text.locationTransfer,
      },
      {
        id: StatusLoadEnum.TransferenciaDePropriedade,
        name: this.text.propertyTransfer,
      },
    ];

    this.LIST_TYPE_BATCH_LOAD_SMART = [
      { id: StatusLoadEnum.Aquisicao, name: this.text.acquisition },
      { id: StatusLoadEnum.Devolucao, name: this.text.devolution },
      {
        id: StatusLoadEnum.EnvioAssistenciaTecnica,
        name: this.text.shippingTechnicalAssistance,
      },
      { id: StatusLoadEnum.Perda, name: this.text.loss },
      {
        id: StatusLoadEnum.RetornoAssistenciaTecnica,
        name: this.text.returnTechnicalAssistance,
      },
      {
        id: StatusLoadEnum.RetornoAssistenciaTecnicaNovo,
        name: this.text.returnTechnicalAssistanceNew,
      },
      {
        id: StatusLoadEnum.RetornoAssistenciaTecnicaSubstituido,
        name: this.text.returnTechnicalAssistanceReplaced,
      },
      {
        id: StatusLoadEnum.TransferenciaDeLocal,
        name: this.text.locationTransfer,
      },
      {
        id: StatusLoadEnum.TransferenciaDePropriedade,
        name: this.text.propertyTransfer,
      },
    ];

    this.LIST_TYPE_SHIPPING_RUN_LOAD = [
      StatusLoadEnum.Devolucao,
      StatusLoadEnum.Perda,
      StatusLoadEnum.TransferenciaDeLocal,
      StatusLoadEnum.TransferenciaDePropriedade,
      StatusLoadEnum.EnvioAssistenciaTecnica,
      StatusLoadEnum.Descarte,
    ];
  }

  public CompareCargoTypeForShipmentExecuting(): void {
    if (
      this.LIST_TYPE_SHIPPING_RUN_LOAD.includes(Number(this.selectLoadType))
    ) {
      this.verifyTypeBatchLoad = true;
    } else {
      this.verifyTypeBatchLoad = false;
    }
  }

  ngOnInit(): void {
    this.getApplications();
  }

  public uploadFile(file: any): void {
    const files = file?.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files);

    reader.onload = () => {
      this.base64 = reader.result.toString();
      this.base64 = this.base64.replace(
        'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
        '',
      );
    };

    [this.fileData] = file.files;
    // eslint-disable-next-line no-param-reassign
    file.value = null;
  }

  public clearFile(): void {
    this.fileData = null;
    this.batchSuccess = null;
    this.enableExport = null;
    this.errorMessage = '';
  }

  public buildImportDeviceObject(): void {
    const GuidEmpty = '00000000-0000-0000-0000-000000000000';
    this.importDevice = {
      email: this.authService.getUserInfo().mail,
      deviceType: this.deviceTypeProcessing(this.selectedTypeDevice),
      deviceStatusLoad: this.selectLoadType,
      moveDate: this.moveDate,
      invoiceProvider: this.invoiceProvider,
      invoiceVale: this.invoice,
      sapPlant: this.sapPlantId,
      emailDeviceManager: this.managerEmail,
      calledCode: this.calledCode,
      importFileBase64: this.base64,
      fileName: this.fileData.name,
      managementId: this.managementNameId,
      groupName: this.groupName,
      groupId: this.groupNameId ?? GuidEmpty,
    };
    if (this.importDevice.emailDeviceManager != null)
      this.importDevice.emailDeviceManager += '@vale.com';
    this.openConfirmLoadModal();
  }

  public openConfirmLoadModal(): void {
    this.modalConfirmLoad = this.matDialog.open(BatchLoadExecutionComponent, {
      panelClass: 'custom-modal-without-padding',
      data: {
        typeBatchLoad: this.verifyTypeBatchLoad,
        importDevices: this.generateConfirmationFields(),
      },
    });
    this.modalConfirmLoad.afterClosed().subscribe(data => {
      if (data) {
        this.loadingPage = true;
        this.devicesService
          .postImportDevice(this.selectedTypeDevice, this.importDevice)
          .subscribe(
            result => {
              if (result) {
                this.batchSuccess = true;
              } else {
                this.matDialog.open(BatchLoadExecutionErrorComponent, {
                  panelClass: 'custom-modal-without-padding',
                });
                this.batchSuccess = false;
                this.enableExport = true;
              }
              this.loadingPage = false;
            },
            error => {
              this.errorMessage = error.error;
              this.loadingPage = false;
            },
          );
      }
    });
  }

  private generateConfirmationFields(): ImportDevicesValidation {
    return {
      deviceType: this.deviceTypeProcessing(
        this.selectedTypeDevice,
      ).toUpperCase(),
      loadType: this.getLoadTypeByApplication(),
      movementDate: this.moveDate,
      calledCode: this.calledCode,
      management: this.management,
      sapPlant: this.sapPlant,
      managerName: `${this.managerEmail}@vale.com`,
      groupName: this.groupName,
      invoiceProvider: this.invoiceProvider,
      invoiceVale: this.invoice,
    };
  }

  private getLoadTypeByApplication(): string {
    const deviceName = this.deviceTypeProcessing(this.selectedTypeDevice);

    if (deviceName.toUpperCase() === ApplicationsName.SMARTBADGE) {
      return this.LIST_TYPE_BATCH_LOAD_SMART.find(
        x => x.id.toString() === this.selectLoadType,
      ).name;
    }

    return this.LIST_TYPE_BATCH_LOAD_SPOT.find(
      x => x.id.toString() === this.selectLoadType,
    ).name;
  }

  public addFile(): void {
    if (this.fileData != null) {
      this.batchSuccess = null;
      this.enableExport = null;
      this.errorMessage = '';
      this.openReplaceFileModal();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  public openReplaceFileModal(): void {
    this.modalReplaceFile = this.matDialog.open(BatchLoadReplaceFileComponent, {
      panelClass: 'custom-modal-without-padding',
    });
    this.modalReplaceFile.afterClosed().subscribe(data => {
      if (data) {
        this.clearFile();
        this.addFile();
      }
    });
  }

  public openCreateSapModal(): void {
    this.modalCreateSAP = this.matDialog.open(BatchLoadPlantSapComponent, {
      panelClass: 'custom-modal-without-padding',
      disableClose: true,
      data: {
        sapPlantName: this.sapPlantValue,
        dataSapPlant: this.dataSapPlant,
      },
    });
    this.modalCreateSAP.afterClosed().subscribe(data => {
      if (data) {
        this.dataSapPlant = null;
        this.sapPlantDisplay();
      }
    });
  }

  public openWantCreateModal(groupName: string, email: string): void {
    this.modalWantCreate = this.matDialog.open(WantCreateModalComponent, {
      height: '240px',
      width: '512px',
      panelClass: 'custom-modal-without-padding',
      disableClose: true,
      data: {
        label: this.translate.instant('BATCH_LOAD_CREATE_GROUP.TITLE'),
        description: groupName,
      },
    });
    this.modalWantCreate.afterClosed().subscribe(createButtonIsTrue => {
      if (createButtonIsTrue) {
        this.createGroupInterface(groupName, email);
      } else {
        this.groupNameShowAlertView = true;
      }
    });
  }

  async createGroupInterface(groupName: string, email: string): Promise<void> {
    const request: CreateGroup = {
      name: groupName,
      managementId: this.managementNameId,
      managerEmail: email,
    };
    this.isLoadingGroup = true;
    this.groupManagementService.CreateGroup(request).subscribe(
      () => {
        const successMessage = this.translate.instant(
          'BATCH_LOAD_CREATE_GROUP.NEW_GROUP',
        );
        this.isLoadingGroup = false;
        this.alertService.showAlertSuccess(successMessage, '');
        this.groupManagementService
          .getDevicesGroupsByGroupName(groupName)
          .subscribe(result =>
            this.assembleGroupNameField(result, groupName, email),
          );
      },
      () => {
        this.isLoadingGroup = false;
        const errorMessage = this.translate.instant(
          'BATCH_LOAD_CREATE_GROUP.ERROR',
        );
        this.alertService.showAlertDanger(errorMessage, '');
      },
    );
  }

  public openExportLoadLogModal(): void {
    const dialogRef = this.matDialog.open(BatchLoadExportLoadLogComponent, {
      height: '402px',
      panelClass: 'custom-modal-without-padding',
    });
    const email = this.authService.getUserInfo().mail;
    dialogRef.componentInstance.send.subscribe(() =>
      this.openExportLogToEmailModal(email),
    );
    dialogRef.componentInstance.next.subscribe(() =>
      this.auditLogService.downloadLoadLog(email, this.calledCode),
    );
  }

  public openExportLogToEmailModal(email: string): void {
    const dialogRef = this.matDialog.open(ExportationRecipientModalComponent, {
      data: {
        recipientEmailAddress: this.authService.getUserInfo().mail,
      },
    });
    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        this.openExportLoadLogModal();
      }
    });
    dialogRef.componentInstance.send.subscribe(() =>
      this.openExportLogToEmailDoneModal(email),
    );
  }

  public openExportLogToEmailDoneModal(email: string): void {
    const importDevices = this.importDevice;
    this.auditLogService.exportLoadLog(email, importDevices);
    this.matDialog.open(ExportationDoneModalComponent);
  }

  public changeDeviceTypeSetNullProperties(): void {
    this.selectLoadType = null;
    this.changeBatchLoadTypeSetNullProperties();
  }

  public changeBatchLoadTypeSetNullProperties(): void {
    [
      this.moveDate,
      this.selectedDeviceGroup,
      this.managerEmail,
      this.sapPlant,
      this.groupName,
      this.groupNameId,
      this.calledCode,
      this.invoice,
      this.invoiceProvider,
      this.management,
      this.batchSuccess,
      this.enableExport,
      this.errorMessage,
      this.managementNameId,
    ] = [
      null,
      null,
      null,
      '',
      '',
      null,
      null,
      null,
      null,
      '',
      null,
      false,
      '',
      null,
    ];
    this.checkField();
    this.clearFile();
    this.CompareCargoTypeForShipmentExecuting();
    this.RequiredFieldsForGroup();
  }

  async getApplications(): Promise<void> {
    try {
      const applications = await this.applicationService.listApplicationsAvailableForUser();
      this.applications = applications.filter(
        element =>
          element.id === this.application.SPOT ||
          element.id === this.application.SMARTBADGE,
      );
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  public managerDisabled(): boolean {
    return (
      this.selectLoadType == null ||
      this.selectLoadType == this.typeBatchLoadEnum.Perda ||
      this.selectLoadType == this.typeBatchLoadEnum.Devolucao ||
      this.selectLoadType == this.typeBatchLoadEnum.Descarte ||
      this.selectLoadType == this.typeBatchLoadEnum.EnvioAssistenciaTecnica ||
      this.selectLoadType == this.typeBatchLoadEnum.RetornoAssistenciaTecnica ||
      this.selectLoadType ==
        this.typeBatchLoadEnum.RetornoAssistenciaTecnicaSubstituido
    );
  }

  public mandatoryManager(): boolean {
    return (
      (this.selectLoadType == null ||
        this.selectLoadType == this.typeBatchLoadEnum.Aquisicao ||
        this.selectLoadType == this.typeBatchLoadEnum.AtivacaoDeLicenca ||
        this.selectLoadType ==
          this.typeBatchLoadEnum.TransferenciaDePropriedade ||
        this.selectLoadType == this.typeBatchLoadEnum.TransferenciaDeLocal ||
        this.selectLoadType ==
          this.typeBatchLoadEnum.RetornoAssistenciaTecnicaNovo) &&
      this.managementNameId == null
    );
  }

  public invoiceDisabled(): boolean {
    return (
      this.selectLoadType == null ||
      this.selectLoadType == this.typeBatchLoadEnum.Aquisicao ||
      this.selectLoadType == this.typeBatchLoadEnum.AtivacaoDeLicenca ||
      this.selectLoadType ==
        this.typeBatchLoadEnum.TransferenciaDePropriedade ||
      this.selectLoadType == this.typeBatchLoadEnum.Descarte ||
      (this.selectedTypeDevice == this.application.SPOT &&
        (this.selectLoadType == this.typeBatchLoadEnum.Devolucao ||
          this.selectLoadType == this.typeBatchLoadEnum.Perda))
    );
  }

  public invoiceProviderDisabled(): boolean {
    return (
      this.selectLoadType == null ||
      this.selectLoadType == this.typeBatchLoadEnum.AtivacaoDeLicenca ||
      this.selectLoadType ==
        this.typeBatchLoadEnum.TransferenciaDePropriedade ||
      this.selectLoadType == this.typeBatchLoadEnum.EnvioAssistenciaTecnica ||
      this.selectLoadType == this.typeBatchLoadEnum.Descarte ||
      (this.selectedTypeDevice == this.application.SPOT &&
        (this.selectLoadType == this.typeBatchLoadEnum.Perda ||
          this.selectLoadType == this.typeBatchLoadEnum.TransferenciaDeLocal))
    );
  }

  public checkField(): void {
    const enabledFields = [
      this.moveDate,
      this.calledCode,
      this.sapPlant,
      this.managerEmail,
    ];

    if (this.checkTheFieldRequiredNameGroup) enabledFields.push(this.groupName);

    if (!this.managerDisabled()) enabledFields.push(this.managerEmail);

    if (!this.invoiceDisabled()) enabledFields.push(this.invoice);

    if (!this.invoiceProviderDisabled())
      enabledFields.push(this.invoiceProvider);

    if (enabledFields.every(val => val && val !== '')) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }

  public sapPlantDisplay(): void {
    this.sapPlantService.getSapPlant().subscribe(data => {
      this.sapPlantLoading = false;
      this.dataSapPlant = data;
    });
  }

  public valueSapPlant(name): void {
    const sapPlantCode = `${name.code}`;
    this.sapPlant = sapPlantCode.concat(' - ', `${name.description}`);
    this.sapPlantId = name.id;
    this.checkField();
    this.sapPlantValidatorView = false;
  }

  public clearEnter(): void {
    this.sapPlant = '';
  }

  public filterSapPlant(): void {
    if (this.dataSapPlant) {
      this.filterDataSapPlants = this.dataSapPlant.sapPlants
        .filter(item => item.code.toString().includes(this.sapPlant))
        .sort(function ordenar(a, b) {
          if (a.code < b.code) return -1;
          if (a.code > b.code) return 1;
          return 0;
        });
    } else {
      this.sapPlantLoading = true;
      this.sapPlantDisplay();
    }
  }

  public eventSapPlant(event: Event): void {
    if (event) {
      this.sapPlantValue = event;
      this.validatorSapPlant(event);
    }
  }

  public validatorSapPlant(event: Event): void {
    const result = this.filterDataSapPlants.filter(x => x.code == event);

    if (result.length > 0) {
      this.sapPlantId = result[0].id;
    } else {
      this.enableButton = false;
      this.sapPlantValidatorView = true;
    }
  }

  public deviceTypeProcessing(applicationId): string {
    if (applicationId == this.application.SPOT) return 'Spot';
    return 'SmartBadge';
  }

  public managementNameDisplay(): void {
    this.managementService.getManagementName().subscribe(data => {
      this.managementNameLoading = false;
      this.dataManagementName = data;
    });
  }

  public clearEnterManagementName(): void {
    this.management = '';
  }

  public filterManagementName(): void {
    if (this.dataManagementName) {
      this.filterDataManagementName = this.dataManagementName.management
        .filter(item =>
          item.code
            .toString()
            .toLowerCase()
            .includes(this.management.toLowerCase()),
        )
        .sort(function ordenar(a, b) {
          if (a.description < b.description) return -1;
          if (a.description > b.description) return 1;
          return 0;
        });
    } else {
      this.managementNameLoading = true;
      this.managementNameDisplay();
    }
  }

  public valueManagementName(item: Management): void {
    const code = `${item.code}`;
    this.management = code.concat(' - ', `${item.description}`);
    this.managementNameId = item.id;
    this.checkField();
    this.managementNameValidatorView = false;
  }

  public validatorManagementName(event: string): void {
    if (event) {
      const result = this.filterDataManagementName.filter(
        item => item.code.toString() == event,
      );

      if (result.length > 0) {
        this.managementNameId = result[0].id;
        this.checkField();
      } else {
        this.managementNameValidatorView = true;
        this.enableButton = false;
      }
    }
  }

  private RequiredFieldsForGroup(): void {
    const listLoadType = [
      StatusLoadEnum.Aquisicao,
      StatusLoadEnum.AtivacaoDeLicenca,
      StatusLoadEnum.TransferenciaDeLocal,
      StatusLoadEnum.TransferenciaDePropriedade,
      StatusLoadEnum.RetornoAssistenciaTecnicaNovo,
    ];
    const isLoadTypeValid = listLoadType.includes(Number(this.selectLoadType));
    this.checkTheFieldRequiredNameGroup = isLoadTypeValid;
    this.groupNameShowAlertView = isLoadTypeValid;
    this.managementNameValidatorView = isLoadTypeValid;
    this.sapPlantValidatorView = isLoadTypeValid;
    this.managerEmailValidatorView = isLoadTypeValid;
  }

  public validatorManagerEmail(): void {
    if (this.managerEmail && !this.checkFirsCharacterOfManagerEmail()) {
      this.managerEmailValidatorView = false;
    } else {
      this.managerEmailValidatorView = true;
    }
  }

  public validateGroup(): void {
    const fields = [this.management, this.managerEmail, this.sapPlant];
    const checksFieldsHaveBeenFilledInCorrectly = [
      this.managerEmailValidatorView,
      this.managementNameValidatorView,
      this.sapPlantValidatorView,
    ];
    const emailDomain = '@vale.com';

    if (
      fields.every(field => field && field !== '') &&
      checksFieldsHaveBeenFilledInCorrectly.every(x => !x)
    ) {
      this.isLoadingGroup = true;
      const management = this.management.replace(' - ', '_');
      const SapPlantCode = this.sapPlant.split(' ')[0];
      const emailFormated = this.managerEmail.split('@')[0];
      const email = `${emailFormated}${emailDomain}`;
      const nameGroup = `${management}_${SapPlantCode}_${email}`;

      this.groupManagementService
        .getDevicesGroupsByGroupName(nameGroup)
        .subscribe(result =>
          this.assembleGroupNameField(result, nameGroup, email),
        );
    }
  }

  private assembleGroupNameField(
    data: ManagerDeviceGroup[],
    nameGroup: string,
    email: string,
  ): void {
    if (data.length) {
      [this.groupDataByName] = data;
      this.groupName = this.groupDataByName.groupName;
      this.groupNameId = this.groupDataByName.groupId;
      this.groupNameShowAlertView = false;
    } else {
      this.groupName = '';
      this.openWantCreateModal(nameGroup, email);
    }
    this.isLoadingGroup = false;
    this.checkField();
  }

  public checkFirsCharacterOfManagerEmail(): boolean {
    if (this.managerEmail) {
      const regex = /^[a-zA-Z]/;
      const CheckRegex = regex.test(this.managerEmail);
      return !CheckRegex;
    }
    return false;
  }
}
