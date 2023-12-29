/* eslint-disable no-unused-expressions */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ExportationDoneModalComponent } from 'src/app/components/exportation-done-modal/exportation-done-modal.component';
import {
  ExportationRecipientModalComponent,
  IExportationRecipientModalComponentData,
} from 'src/app/components/exportation-recipient-modal/exportation-recipient-modal.component';
import { FeatureFlags } from 'src/app/core/constants/feature-flags.const';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import {
  DeviceAssociation,
  DeviceAssociationThing,
  Devices,
} from 'src/app/model/devices-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import { DevicesService } from 'src/app/services/factories/devices.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { IFeatureFlag } from 'src/app/shared/interfaces/feature-flag.interface';
import { MovementHistoryListResponse } from 'src/app/shared/interfaces/movement-history-list-response.interface';
import { MovementHistoryList } from 'src/app/shared/interfaces/movement-history-list.interface';
import { FixMeLater } from 'src/app/shared/types/shared-types';
import { translateStatusLoad } from 'src/app/shared/utils/status-load-helper/status-load-helper';
import { FeatureFlagsStateService } from 'src/app/stores/feature-flags/feature-flags-state.service';

interface TextMessages {
  deviceNotFound: string;
  deviceDisassociate: string;
  deviceSuccess: string;
  deviceExist: string;
  deviceError: string;
}

@Component({
  selector: 'app-devices-home',
  templateUrl: './devices-home.component.html',
  styleUrls: ['./devices-home.component.scss'],
})
export class DevicesHomeComponent implements OnInit {
  public deviceResume: DeviceAssociation;

  public associatedThing: DeviceAssociationThing;

  public applications: ApplicationItem[] = [];

  public selectedApplicationId = '';

  public selectedDeviceIdentificator = '';

  public devices: DeviceAssociation[] = [];

  public associatedThings = [];

  private isDeviceGroupFilteringFlagOn = false;

  private text: TextMessages = {
    deviceExist: '',
    deviceError: '',
    deviceSuccess: '',
    deviceNotFound: '',
    deviceDisassociate: '',
  };

  private _searchinput: string;

  public get searchinput(): string {
    return this._searchinput;
  }

  public set searchinput(value: string) {
    this._searchinput = value;
  }

  public isExportationButtonDisabled = true;

  public devices$: Observable<Devices>;

  public applications$: Observable<FixMeLater>;

  public searching = false;

  doesApplicationAllowAssociation = false;

  isDeviceAssociated = false;

  public currentlySelectedApplication: ApplicationItem;

  public showDeviceGroupRestrictionDisclaimer = false;

  public showAddDeviceButton = false;

  public canUserEditDevice = false;

  public hasLoadedMovementHistory = false;

  public movementHistoryList: MovementHistoryList[] = [];

  public isLoadingMovementList = true;

  public statusLoadTranslation: any;

  constructor(
    private applicationService: ApplicationsService,
    private devicesService: DevicesService,
    private alertService: AlertModalService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private authService: AuthService,
    public modalService: BsModalService,
    private loggingService: LoggingService,
    private dialog: MatDialog,
    private featureFlagsStateService: FeatureFlagsStateService,
  ) {
    this.configureTranslateMessages();
  }

  ngOnInit(): void {
    this.featureFlagsStateService.featureFlags$.subscribe(featureFlag => {
      this.isDeviceGroupFilteringFlagOn = featureFlag?.find(
        f => f.name === FeatureFlags.DeviceGroupFiltering,
      )?.value;
    });

    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para home de devices',
    );
    this.route.params.pipe(take(1)).subscribe(
      data => {
        this.selectedApplicationId = data.applicationId || '';
        this.selectedDeviceIdentificator = data.deviceIdentificator || '';

        this.selectedApplicationId
          ? this.redirectedFromApplications(
              this.selectedApplicationId,
              this.selectedDeviceIdentificator,
            )
          : this.getApplications();

        if (this.selectedApplicationId && this.selectedDeviceIdentificator) {
          this.getBySourceInfo(
            this.selectedApplicationId,
            this.selectedDeviceIdentificator,
          );
        }
      },
      error => this.loggingService.logException(error, SeverityLevel.Warning),
    );

    this.getUserRoleAndApplyRules();
  }

  private getUserRoleAndApplyRules(): void {
    this.featureFlagsStateService.featureFlags$
      .pipe(filter(x => !!x))
      .subscribe(featureFlagResponse => {
        this.checkIfDisclaimerShouldBeShown(featureFlagResponse);
        this.checkIfAddDeviceButtonShouldBeShown();
        this.checkIfUserCanEditDevice();
      });
  }

  private checkIfAddDeviceButtonShouldBeShown(): void {
    this.showAddDeviceButton =
      this.authService.getUserInfo().role === Roles.Administrador;
  }

  private checkIfUserCanEditDevice(): void {
    this.canUserEditDevice =
      this.authService.getUserInfo().role === Roles.Administrador;
  }

  private checkIfDisclaimerShouldBeShown(
    featureFlagResponse: IFeatureFlag[],
  ): void {
    this.showDeviceGroupRestrictionDisclaimer =
      featureFlagResponse.find(
        featureFlag =>
          featureFlag.name === FeatureFlags.IsSecurityInfoDisclaimerEnabled,
      )?.value && this.authService.getUserInfo().role !== Roles.Administrador;
  }

  exportButtonHandle(): void {
    const dialogRef = this.dialog.open(ExportationRecipientModalComponent, {
      closeOnNavigation: false,
      disableClose: true,
      data: {
        recipientEmailAddress: this.authService.getUserInfo().mail,
      } as IExportationRecipientModalComponentData,
    });
    dialogRef.componentInstance.send.subscribe(() => {
      this.applicationService
        .exportDevices(
          this.selectedApplicationId,
          this.authService.getUserInfo().mail,
        )
        .toPromise();
      this.dialog.open(ExportationDoneModalComponent, {
        closeOnNavigation: false,
        disableClose: true,
      });
    });
  }

  redirectedFromApplications(
    applicationId: string,
    deviceIdentificator: string,
  ): void {
    this.getApplications();
    this.selectedApplicationId = applicationId;
    this.selectedDeviceIdentificator = deviceIdentificator;

    this.searchinput = this.selectedDeviceIdentificator;

    this.loggingService.logEventWithUserInfo(
      'Navegou para devices de applications/update',
    );
  }

  async getApplications(): Promise<void> {
    try {
      const applications = await this.applicationService.listApplicationsAvailableForUser();
      this.applications = applications;
      this.currentlySelectedApplication = this.getCurrentlySelectedApplication();
    } catch (error) {
      this.loggingService.logException(error, SeverityLevel.Warning);
    }
  }

  /**
   * Is triggered when an application is selected from dropdown
   * @param applicationId selected application id
   */
  handleApplicationSelection(applicationId: string): void {
    this.searchinput = null;
    this.devices$ = null;
    this.selectedApplicationId = applicationId;
    const selectedApplication = this.applications.find(
      a => a.id === applicationId,
    );
    this.verifyIfExportingIsAllowed(selectedApplication);
    this.verifyIfApplicationAllowsAssociation(selectedApplication);
  }

  private verifyIfApplicationAllowsAssociation(
    selectedApplication: ApplicationItem,
  ): void {
    this.doesApplicationAllowAssociation =
      selectedApplication?.allowDeviceAssociation;
  }

  private verifyIfExportingIsAllowed(
    selectedApplication: ApplicationItem,
  ): void {
    this.isExportationButtonDisabled = !selectedApplication?.allowDeviceAssociation;
  }

  getCurrentlySelectedApplication(): ApplicationItem {
    if (this.selectedApplicationId) {
      const selectedApplicationObject = this.applications.find(
        application => application.id === this.selectedApplicationId,
      );

      return selectedApplicationObject;
    }

    return {
      id: '',
      name: '',
      description: '',
      allowDeviceAssociation: false,
      allowInclusionDeviceGroup: false,
      showInDeviceTypesList: false,
      status: false,
      createdAt: '',
      updatedAt: '',
    };
  }

  getBySourceInfo(applicationId: string, sourceValue: string): void {
    this.hasLoadedMovementHistory = false;

    if (sourceValue && applicationId) {
      this.deviceResume = null;
      this.selectedDeviceIdentificator = sourceValue;
      this.searching = true;

      this.devices$ = this.devicesService.getBySourceInfo(
        applicationId,
        sourceValue,
      );
      this.devices$.subscribe(
        (data: Devices) => {
          this.devices = data.devices;

          if (this.devices?.length) {
            const [device] = this.devices;
            this.deviceResume = device;
            this.isDeviceAssociated =
              device.associatedThings?.length &&
              !device.associatedThings[0]?.disassociationDate;
            const [thing] = this.deviceResume.associatedThings || [];
            this.associatedThing = thing;
          } else this.errorModalMessage();

          this.currentlySelectedApplication = this.getCurrentlySelectedApplication();

          this.searching = false;
        },
        error => {
          this.loggingService.logException(error, SeverityLevel.Warning);
          this.searching = false;
          this.errorModalMessage();
        },
      );
    } else {
      this.alertService.showAlertDanger(
        'Indentificador',
        'Por favor informe o identificado do dispositivo',
      );
    }
  }

  associationHandler(value: boolean): void {
    if (value) {
      this.getBySourceInfo(
        this.selectedApplicationId,
        this.selectedDeviceIdentificator,
      );
      this.resetAssociationList();
    }
  }

  resetAssociationList(): void {
    document
      .querySelectorAll('.checkbox')
      .forEach((element: HTMLInputElement) => {
        element.checked = false;
      });
  }

  private configureTranslateMessages(): void {
    this.translate
      .get('DEVICE_UPDATE.DEVICE_HISTORY_MOVEMENT.STATUS_TYPE')
      .subscribe(message => {
        this.statusLoadTranslation = message;
      });

    this.translate
      .get('DEVICE_UPDATE.SAVE_RESPONSE.DEVICE_EXIST')
      .subscribe(message => {
        this.text.deviceError = message;
      });

    this.translate.get('DEVICE_UPDATE.SAVE_RESPONSE.200').subscribe(message => {
      this.text.deviceSuccess = message;
    });

    this.translate.get('DEVICE_UPDATE.SUCCESS').subscribe(message => {
      this.text.deviceSuccess = message;
    });

    this.translate.get('DEVICE_LIST.DEVICE_NOT_FOUND').subscribe(message => {
      this.text.deviceNotFound = message;
    });

    this.translate
      .get('DEVICE_LIST.DEVICE_BOX.ASSOCIATION.1')
      .subscribe(message => {
        this.text.deviceDisassociate = message;
      });
  }

  private errorModalMessage(): void {
    if (
      (this.authService.getUserInfo().role === Roles.Paebm ||
        this.authService.getUserInfo().role === Roles.AnalistaOperacional) &&
      this.isDeviceGroupFilteringFlagOn
    ) {
      const errorMessage = this.translate.instant(
        'DEVICE_LIST.NO_DEVICES_INFO_WHEN_IN_DEVICE_GROUP',
      );
      this.alertService.showAlertDanger(errorMessage);
    } else {
      const errorMessageWhenNotInDeviceGroup = this.translate.instant(
        'DEVICE_LIST.NO_DEVICES_INFO',
      );
      this.alertService.showAlertDanger(errorMessageWhenNotInDeviceGroup);
    }
  }

  public updateDevice(body: FixMeLater): void {
    const { id } = body;
    const { applicationId } = this.deviceResume.device;
    body.applicationId = applicationId;
    this.devicesService.update(applicationId, id, body).subscribe(
      () => {
        this.loggingService.logEventWithUserInfo(
          'Portal TM - Editou um device',
        );

        this.alertService.showAlertSuccess(this.text.deviceSuccess);
      },
      error => {
        this.alertService.showAlertDanger(this.text.deviceExist);
        this.loggingService.logException(error, SeverityLevel.Warning);
      },
    );
  }

  public getMovementHistoryInformation(event: any): void {
    if (event.index === 1 && !this.hasLoadedMovementHistory) {
      this.isLoadingMovementList = true;
      const { id, applicationId } = this.deviceResume.device;
      this.devicesService
        .getDeviceMovementHistoryInformation(applicationId, id)
        .subscribe((historicList: MovementHistoryListResponse[]) => {
          this.movementHistoryList = this.mapHistoricListResponse(historicList);
          this.hasLoadedMovementHistory = true;
          this.isLoadingMovementList = false;
        });
    }
  }

  private mapHistoricListResponse(
    historicList: MovementHistoryListResponse[],
  ): MovementHistoryList[] {
    return historicList.map((movement: MovementHistoryListResponse) => {
      return {
        moveDate: movement.moveDate,
        calledCode: movement.calledCode,
        statusLoad: translateStatusLoad(
          movement.statusLoad,
          this.statusLoadTranslation,
        ),
      };
    });
  }
}
