import { Component, EventEmitter, Output } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { CpfValidatorService } from 'src/app/services/validators/cpf-validator/cpf-validator.service';
import { SourceInfosValidatorService } from 'src/app/services/validators/source-infos-validator/source-infos-validator.service';
import { Document } from 'src/app/views/things/things.const';
import { DropDownRelationType } from 'src/app/shared/enums/dropDownRelationType.enums';
import { RelationTypeConst } from 'src/app/shared/constantes/relation-type.const';

@Component({
  selector: 'app-tc-form',
  templateUrl: 'tc-form.component.html',
  styleUrls: ['tc-form.component.scss'],
})
export class ThingCreateFormComponent {
  @Output() submit = new EventEmitter();

  public types = [{ id: 1, value: 'Person' }];

  public primaryKey = Document.CPF;

  public document = Document;

  public selectedType = 1;

  public name: string;

  public description: string;

  public disabled = false;

  public companyName: string;

  public relationTypeKeys = [];

  public dropDownRelationType = DropDownRelationType;

  public selectedRelationType = DropDownRelationType.Visitante;

  public sourceValueCPF: string;

  public sourceValueIAM: string;

  public sourceValuePASSPORT: string;

  public notIdentifiedUser = RelationTypeConst.NaoIdentificado;

  constructor(
    public alertModalService: AlertModalService,
    public loggingService: LoggingService,
    private cpfService: CpfValidatorService,
    private sourInfosValidator: SourceInfosValidatorService,
  ) {
    this.relationTypeKeys = Object.keys(this.dropDownRelationType);
  }

  formCreateValidation(thing): boolean {
    if (!thing.name || (!thing.name.match(' ') && this.name.trim())) {
      this.alertModalService.showAlertDanger(
        'Por favor, insira um nome completo.',
        '',
      );
      this.loggingService.logException(
        new Error('Tentou criar uma thing sem informar um nome'),
        SeverityLevel.Information,
      );
      this.disabled = false;
      return false;
    }

    const thingHasDocument = thing.sourceInfos.find(
      element =>
        (element.type === Document.CPF && this.primaryKey === Document.CPF) ||
        (element.type === Document.PASSPORT &&
          this.primaryKey === Document.PASSPORT),
    );

    if (!thing.sourceInfos.length || !thingHasDocument) {
      this.alertModalService.showAlertDanger(
        'Por favor, insira o número de documento.',
        '',
      );
      this.loggingService.logException(
        new Error('Tentou criar uma thing sem informar um número de documento'),
        SeverityLevel.Information,
      );
      this.disabled = false;
      return false;
    }
    return true;
  }

  sourceTypeValidation(list: any): boolean {
    if (list.length && this.sourInfosValidator.validateSourceInfos(list)) {
      this.alertModalService.showAlertDanger(
        'O número do documento não é válido',
        '',
      );
      this.loggingService.logException(
        new Error(
          'Tentou criar uma thing com um número de documento com mais caractéres do que o permitido',
        ),
        SeverityLevel.Information,
      );
      this.disabled = false;

      return false;
    }
    return true;
  }

  validateCpf(sourceInfos) {
    const hasCPF = sourceInfos.find(element => element.type === Document.CPF);

    if (
      hasCPF &&
      !this.cpfService.evaluateCpf(hasCPF.value) &&
      hasCPF?.value !== ''
    ) {
      this.loggingService.logException(
        new Error('Digitou um número de CPF Inválido'),
        SeverityLevel.Information,
      );
      this.disabled = false;
      return false;
    }
    return true;
  }

  createObject() {
    const thingToBeCreated: any = {
      type: this.selectedType,
      name: this.name,
      relationType: this.selectedRelationType,
      description: this.description,
      companyInfo: { companyName: this.companyName },
    };

    const sourceInfos = [];
    if (this.sourceValueIAM)
      sourceInfos.push({ type: Document.IAMID, value: this.sourceValueIAM });
    if (this.sourceValuePASSPORT && this.primaryKey === Document.PASSPORT)
      sourceInfos.push({
        type: Document.PASSPORT,
        value: this.sourceValuePASSPORT,
      });

    if (this.sourceValueCPF && this.primaryKey === Document.CPF) {
      this.sourceValueCPF = this.sourceValueCPF.replace(/(\d{3})(\d)/, '$1.$2');
      this.sourceValueCPF = this.sourceValueCPF.replace(/(\d{3})(\d)/, '$1.$2');
      this.sourceValueCPF = this.sourceValueCPF.replace(
        /(\d{3})(\d{1,2})$/,
        '$1-$2',
      );

      if (this.sourceValueCPF && this.primaryKey === Document.CPF)
        sourceInfos.push({ type: Document.CPF, value: this.sourceValueCPF });
    }

    thingToBeCreated.sourceInfos = sourceInfos;

    return thingToBeCreated;
  }

  onSubmit(event) {
    this.disabled = true;

    setTimeout(() => {
      this.disabled = false;
    }, 1000);

    const body = this.createObject();

    if (!this.formCreateValidation(body)) {
      return;
    }

    if (!this.sourceTypeValidation(body.sourceInfos)) {
      return;
    }

    if (
      !this.validateCpf(body.sourceInfos) &&
      this.primaryKey === Document.CPF
    ) {
      return;
    }
    this.submit.emit(body);
  }
}
