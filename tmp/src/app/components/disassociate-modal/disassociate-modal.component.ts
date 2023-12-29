import { Component, EventEmitter, OnInit } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { AssociationDesassociationScreenEnum } from 'src/app/shared/enums/associationDesassociationScreen';

interface DisassociationPayload {
  applicationId: string;
  deviceId: string;
  associationDate: string;
  disassociationDate: string;
  screen: AssociationDesassociationScreenEnum;
}

@Component({
  selector: 'app-disassociate-modal',
  templateUrl: './disassociate-modal.component.html',
  styleUrls: ['./disassociate-modal.component.scss'],
})
export class DisassociateModalComponent implements OnInit {
  public singleData: any;

  public event = new EventEmitter();

  private text: { [key: string]: string } = {};

  private thingId: string;

  private applicationId: string;

  private deviceId: string;

  constructor(
    private loggingService: LoggingService,
    private bsModalRef: BsModalRef,
    private associationPeriodsService: AssociationPeriodsService,
    private alertService: AlertModalService,
    private translate: TranslateService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.setupTranslatedResources();
  }

  public onClose(): void {
    this.bsModalRef.hide();
  }

  public onRequestDisassociation(): void {
    const { associatedThings, device, screen } = this.singleData;

    const { applicationId, id: deviceId } = device;

    const thingToBeDesassociated = associatedThings.find(
      associatedThing => !associatedThing.disassociationDate,
    );

    const { thing, id: periodId, associationDate } = thingToBeDesassociated;

    const { id: thingId } = thing;

    const body = this.setupDisassociationPayloadBody(
      applicationId,
      deviceId,
      associationDate,
      screen,
    );

    this.storeThingDeviceAndApplicationIds(deviceId, applicationId, thingId);

    this.disassociate(thingId, periodId, body);
  }

  private disassociate(
    thingId: string,
    periodId: string,
    body: DisassociationPayload,
  ): void {
    this.associationPeriodsService
      .disassociate(thingId, periodId, body)
      .subscribe(
        response => {
          this.loggingService.logEvent(
            `Portal TM - Realizou uma desassociação 
          do device de id: ${this.deviceId}, 
          da aplicação de id: ${this.applicationId}, 
          da thing de id: ${this.thingId}`,
            this.setupLogPayloadBody(),
          );

          this.event.emit(response);
          this.onClose();
          this.alertService.showAlertSuccess(this.text.disassociateSucess, '');
        },
        error => {
          this.alertService.showAlertDanger(this.text.disassociateError, '');
          this.loggingService.logException(error, SeverityLevel.Warning);
        },
      );
  }

  private setupDisassociationPayloadBody(
    applicationId: string,
    deviceId: string,
    associationDate: string,
    screen: AssociationDesassociationScreenEnum,
  ): DisassociationPayload {
    return {
      applicationId,
      deviceId,
      associationDate,
      disassociationDate: new Date().toISOString(),
      screen,
    };
  }

  private setupLogPayloadBody() {
    const userInfo = this.authService.getUserInfo();
    return {
      User: userInfo.UserFullName,
      UserName: userInfo.mail,
      deviceId: this.deviceId,
      thingId: this.thingId,
      applicationId: this.applicationId,
    };
  }

  private storeThingDeviceAndApplicationIds(
    deviceId: string,
    applicationId: string,
    thingId: string,
  ): void {
    this.deviceId = deviceId;
    this.applicationId = applicationId;
    this.thingId = thingId;
  }

  public setupTranslatedResources(): void {
    this.translate
      .get('DEVICE_LIST.MODAL.DISASSOCIATE.DISASSOCIATE_RESPONSE.200')
      .subscribe(a => {
        this.text.disassociateSucess = a;
      });
    this.translate
      .get('DEVICE_LIST.MODAL.DISASSOCIATE.DISASSOCIATE_RESPONSE.500')
      .subscribe(b => {
        this.text.disassociateError = b;
      });
  }
}
