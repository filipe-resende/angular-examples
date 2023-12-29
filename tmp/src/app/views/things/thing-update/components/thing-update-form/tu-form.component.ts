import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ThingItem } from 'src/app/model/things-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { ThingsService } from 'src/app/services/factories/things.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { CpfValidatorService } from 'src/app/services/validators/cpf-validator/cpf-validator.service';
import { SourceInfosValidatorService } from 'src/app/services/validators/source-infos-validator/source-infos-validator.service';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { Document, Origins } from 'src/app/views/things/things.const';
import { DropDownRelationType } from 'src/app/shared/enums/dropDownRelationType.enums';
import { TranslateService } from '@ngx-translate/core';
import { RelationTypeConst } from 'src/app/shared/constantes/relation-type.const';
import { MatDialog } from '@angular/material/dialog';
import { ReactivateSubscriptionModalComponent } from 'src/app/components/reactivate-subscription-modal/reactivate-subscription-modal.component';
import { ApplicationsIds } from 'src/app/core/constants/applications.const';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tu-form',
  templateUrl: 'tu-form.component.html',
  styleUrls: ['tu-form.component.scss'],
})
export class ThingsUpdateFormComponent implements OnChanges {
  [x: string]: any;

  @Input() formData: any;

  @Input() submited = false;

  @Output() onSubmit = new EventEmitter();

  @Output() onSubmitReactivation = new EventEmitter();

  public document = Document;

  public dropDownRelationType = DropDownRelationType;

  public relationTypeKeys = [];

  public selectedRelationType = DropDownRelationType.Visitante;

  public isEditable = false;

  public originalThingHasDocument = true;

  public primaryKey = Document.CPF;

  public thingTypes = [{ id: 1, value: 'Person' }];

  public sourceValueIAM: string;

  public sourceTypeIAM: string;

  public sourceValueMDM: string;

  public sourceValuePASSPORT: string;

  public sourceValueCPF: string;

  public thingToBeUpdated: ThingItem;

  public originalCopy: any;

  public relationType: string;

  public companyName: string;

  public name: string;

  public selectedType: string;

  public description: string;

  public originInformation: string;

  public disabled = false;

  public isEditingAllowed = false;

  public activeUser = false;

  public notIdentifiedUser = RelationTypeConst.NaoIdentificado;

  public translateResource: { [key: string]: string } = {};

  constructor(
    private loggingService: LoggingService,
    private alertModalService: AlertModalService,
    private sourInfosValidator: SourceInfosValidatorService,
    private cpfValidator: CpfValidatorService,
    private authService: AuthService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private thingsService: ThingsService,
    private alertService: AlertModalService,
  ) {}

  ngOnInit(): void {
    this.setupTranslateFilesResources();
  }

  ngOnChanges() {
    this.setForm();
  }

  private setForm() {
    this.originalCopy = { ...this.formData };
    this.setData(this.formData);
    this.verifyIfEditingIsAllowed();
    this.originalThingHasDocument = this.originalCopy.sourceInfos.find(
      element =>
        (element.type === Document.CPF && this.primaryKey === Document.CPF) ||
        (element.type === Document.PASSPORT &&
          this.primaryKey === Document.PASSPORT),
    );
    this.isEditable = this.originalCopy.origin === Origins.SECURITY_CENTER;
    this.activeUser = this.originalCopy.status;
  }

  private verifyIfEditingIsAllowed() {
    this.isEditingAllowed = [
      Roles.Administrador,
      Roles.AnalistaSegurancaEmpresarial,
      Roles.Paebm,
    ].includes(this.authService.getUserInfo().role);
  }

  setData(thing: ThingItem) {
    this.relationTypeKeys = Object.keys(this.dropDownRelationType);
    this.name = thing.name;
    this.selectedType = thing.companyInfo.relationType;
    this.description = thing.description;
    this.relationType = thing.relationName;
    this.companyName = thing.companyInfo?.companyName;
    this.status = thing.status;
    this.originInformation = thing.updatedBy;

    switch (thing.companyInfo.relationType) {
      case DropDownRelationType.Vale:
        this.relationTypeKeys = ['Visitante', 'Vale'];
        this.selectedRelationType = DropDownRelationType.Vale;
        break;
      case DropDownRelationType.Terceiro:
        this.relationTypeKeys = ['Visitante', 'Terceiro'];
        this.selectedRelationType = DropDownRelationType.Terceiro;
        break;
      case DropDownRelationType.Visitante:
        this.relationTypeKeys = ['Visitante'];
        this.selectedRelationType = DropDownRelationType.Visitante;
        break;
      default:
        this.relationTypeKeys = ['Visitante', 'NaoIdentificado'];
        this.selectedRelationType = DropDownRelationType.NaoIdentificado;
        break;
    }

    thing.sourceInfos.forEach(element => {
      switch (element.type.toUpperCase()) {
        case Document.IAMID:
          this.sourceValueIAM = element.value;
          this.sourceTypeIAM = Document.IAMID;
          break;
        case Document.PASSPORT:
          this.primaryKey = Document.PASSPORT;
          this.sourceValuePASSPORT = element.value;
          break;
        case Document.CPF:
          this.primaryKey = Document.CPF;
          this.sourceValueCPF = element.value;
          break;
      }

      switch (element.type) {
        case Document.MDMID_CONTRACTOR:
        case Document.MDMID_EMPLOYEE:
        case Document.MDMID:
          this.sourceValueMDM = element.value;
          break;
      }
    });
    let origin;

    switch (thing.origin) {
      case Origins.NOT_IDENTIFIED:
        origin = 'NOT_IDENTIFIED_ORIGIN';
        break;
      case Origins.SECURITY_CENTER:
        origin = 'SECURITY_CENTER_ORIGIN';
        break;
      case Origins.DOM:
        origin = 'DOM_ORIGIN';
        break;
      case Origins.TMP:
        origin = 'THINGS_MANAGEMENT_ORIGIN';
        break;
    }

    this.originInformation = this.translate.instant(`THING_UPDATE.${origin}`);

    const thingHasTwoDocuments = thing.sourceInfos.filter(
      si => si.type === Document.CPF || si.type === Document.PASSPORT,
    ).length;

    if (thingHasTwoDocuments > 1) {
      this.primaryKey = Document.CPF;
    }
  }

  validData(dados: any[]) {
    return dados.some(dado => dado.value !== '');
  }

  formUpdateValidation(thingToBeUpdated: any) {
    if (!thingToBeUpdated.name || !this.name.match(' ')) {
      this.loggingService.logException(
        new Error(this.translateResource.EDIT_THING_ERROR),
        SeverityLevel.Information,
      );
      this.alertModalService.showAlertDanger(
        this.translateResource.INCOMPLETE_NAME,
        '',
      );
      this.disabled = false;
      return false;
    }

    const thingHasDocument = thingToBeUpdated.sourceInfos.find(
      element =>
        (element.type === Document.CPF &&
          this.primaryKey === Document.CPF &&
          element.value !== '') ||
        (element.type === Document.PASSPORT &&
          this.primaryKey === Document.PASSPORT &&
          element.value !== ''),
    );

    if (!this.validData(thingToBeUpdated.sourceInfos) || !thingHasDocument) {
      this.loggingService.logException(
        new Error(this.translateResource.INCOMPLETE_DOCUMENT),
        SeverityLevel.Information,
      );
      this.alertModalService.showAlertDanger(
        this.translateResource.INCOMPLETE_DOCUMENT_NUMBER,
        '',
      );
      this.disabled = false;
      return false;
    }
    return true;
  }

  sourceTypeValidation(list: any) {
    if (this.sourInfosValidator.validateSourceInfos(list)) {
      this.alertModalService.showAlertDanger(
        this.translateResource.INVALID_DOCUMENT_NUMBER,
        '',
      );
      this.loggingService.logException(
        new Error(this.translateResource.LARGE_DOCUMENT_NUMBER),
        SeverityLevel.Information,
      );
      return false;
    }
    return true;
  }

  cpfValidation(sourceInfos) {
    const hasCPF = sourceInfos.find(
      el => el.type === Document.CPF && this.primaryKey === Document.CPF,
    );

    if (hasCPF && hasCPF?.value !== '') {
      if (!this.cpfValidator.evaluateCpf(hasCPF?.value)) {
        this.loggingService.logException(
          new Error(this.translateResource.INVALID_CPF_NUMBER),
          SeverityLevel.Information,
        );
        this.disabled = false;
        return false;
      }
    }
    return true;
  }

  createThingObject(): ThingItem {
    this.formData.type = this.type;
    this.formData.name = this.name.trim();
    this.formData.relationType = this.selectedRelationType;
    this.formData.description = this.description;
    this.formData.companyInfo = {
      companyName: this.companyName,
      relationType: this.selectedRelationType,
    };
    return this.formData;
  }

  /* eslint-disable no-param-reassign */
  formatCpf(value: string) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  /* eslint-disable no-param-reassign */
  /* eslint-disable consistent-return */
  updateSourceInfos(value: string, type: string) {
    value = value.replace(/\s+/g, '');

    if (type === Document.CPF && value.length > 14) {
      this.formatCpf(value);
      return;
    }

    this.formData.sourceInfos = this.formData.sourceInfos.filter(
      element => element.type !== type,
    );

    this.formData.sourceInfos.push({ type, value });

    return this.formData.sourceInfos;
  }

  handleOnSubmit() {
    this.disabled = true;

    setTimeout(() => {
      this.disabled = false;
    }, 1000);

    if (!this.submited) {
      const body = this.createThingObject();

      if (!this.formUpdateValidation(body)) {
        return;
      }

      if (!this.cpfValidation(body.sourceInfos)) {
        return;
      }

      if (!this.sourceTypeValidation(body.sourceInfos)) {
        return;
      }

      this.onSubmit.emit(body);
    }
  }

  public setUpdateDataOfThing(thingToBeUpdated: ThingItem): void {
    this.thingsService
      .reactivateThing(thingToBeUpdated.id, thingToBeUpdated)
      .subscribe(() => {
        this.onSubmitReactivation.emit(thingToBeUpdated);
        this.alertService.showAlertSuccess(
          this.translateResource.SUCCESSFULLY_REACTIVATED,
          '',
        );
      });
  }

  public openReactivationSubscriptionDialog() {
    const modal = this.dialog.open(ReactivateSubscriptionModalComponent, {
      data: {
        message: 'THING_UPDATE.REACTIVATION_MESSAGE',
      },
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.setUpdateDataOfThing(this.formData);
      }
    });
  }

  private setupTranslateFilesResources(): void {
    this.translateResources = this.translate
      .get('LOG_MESSAGES')
      .pipe(
        map(
          ({
            SUCCESSFULLY_REACTIVATED,
            INCOMPLETE_NAME,
            EDIT_THING_ERROR,
            INCOMPLETE_DOCUMENT,
            INCOMPLETE_DOCUMENT_NUMBER,
            INVALID_DOCUMENT_NUMBER,
            LARGE_DOCUMENT_NUMBER,
            INVALID_CPF_NUMBER,
          }) => {
            return {
              SUCCESSFULLY_REACTIVATED,
              INCOMPLETE_NAME,
              EDIT_THING_ERROR,
              INCOMPLETE_DOCUMENT,
              INCOMPLETE_DOCUMENT_NUMBER,
              INVALID_DOCUMENT_NUMBER,
              LARGE_DOCUMENT_NUMBER,
              INVALID_CPF_NUMBER,
            };
          },
        ),
      )
      .subscribe(resources => {
        this.translateResource = resources;
      });
  }
}
