import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DeviceThingAssociation } from 'src/app/model/device-thing-association-interface';
import {
  ThingItem,
  Things,
  ThingWithSourceInfos,
} from 'src/app/model/things-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
import { ThingsService } from 'src/app/services/factories/things.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { AssociationDesassociationScreenEnum } from 'src/app/shared/enums/associationDesassociationScreen';
import { SourceInfos } from 'src/app/shared/enums/sourceInfo.enum';
import { ReactivateSubscriptionModalComponent } from 'src/app/components/reactivate-subscription-modal/reactivate-subscription-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-things-modal',
  templateUrl: './things-modal.component.html',
  styleUrls: ['./things-modal.component.scss'],
})
export class ThingsModalComponent implements OnInit {
  @Input() externalData;

  @Output() onSubmitReactivation = new EventEmitter();

  public allThingsList: ThingItem[] = [];

  public translateResource: { [key: string]: string } = {};

  public singleExternalData: any;

  public thingsFormGroup: FormGroup;

  public subscriptions: Subscription[] = [];

  public applicationId: string;

  public showDropDown = false;

  public searchInput = '';

  public event = new EventEmitter();

  public thingsPreview = [];

  public disabled = false;

  public thingsForTable: ThingWithSourceInfos[] = [];

  public thingId: string;

  public deviceId: string;

  public screen: AssociationDesassociationScreenEnum;

  public things$: Observable<any>;

  private text: any = {};

  public placeholder = '';

  public isEdit = true;

  public selectedType = '';

  public typeOptions = [
    { name: 'Name', value: 'NOME' },
    { name: 'CPF', value: 'CPF' },
    { name: 'IAMID', value: 'IAMID' },
    { name: 'PASSPORT', value: 'Passaporte' },
  ];

  public displayedColumns: string[] = [
    'name',
    'cpf',
    'passport',
    'iam',
    'status',
    'email',
  ];

  public type = '';

  public isLoading = false;

  private pvSourceValue: string;

  public isAllowedToSeeCpf: boolean;

  public get sourceValue(): string {
    return this.pvSourceValue;
  }

  public set sourceValue(value: string) {
    this.pvSourceValue = value;
    if (!this.sourceValue) this.getThings(0, 5);
  }

  private currentPage = 1;

  private pageSize = 10;

  private isWaitingForThingsReturn = false;

  private isLastSearchEmpty = false;

  constructor(
    private loggingService: LoggingService,
    private bsModalRef: BsModalRef,
    private thingsService: ThingsService,
    private associationPeriodsService: AssociationPeriodsService,
    private alertService: AlertModalService,
    private translate: TranslateService,
    private alertModalService: AlertModalService,
    private authService: AuthService,
    private fb: FormBuilder,
    public options: ModalOptions,
    private dialog: MatDialog,
  ) {
    this.thingsFormGroup = this.fb.group({
      byName: '',
    });
    this.translate
      .get('DEVICE_LIST.MODAL.ASSOCIATE.ASSOCIATION_RESPONSE.200')
      .subscribe(a => {
        this.text.associateSucess = a;
      });
    this.translate
      .get('DEVICE_LIST.MODAL.ASSOCIATE.ASSOCIATION_RESPONSE.500')
      .subscribe(b => {
        this.text.associateError = b;
      });
    this.translate
      .get('DEVICE_LIST.MODAL.ASSOCIATE.ASSOCIATION_RESPONSE.SELECT_THING')
      .subscribe(c => {
        this.text.associateErrorThing = c;
      });
    this.translate
      .get('DEVICE_LIST.MODAL.ASSOCIATE.ASSOCIATION_RESPONSE.422')
      .subscribe(d => {
        this.text.errorAssociatingDevice = d;
      });
  }

  public ngOnInit(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - abriu o modal de associação',
    );
    this.changeNameInputSub();
    this.singleExternalData = this.options.initialState;
    this.isAllowedToSeeCpf = this.authService.isUserAllowedToSeeCPF();

    if (!this.isAllowedToSeeCpf) {
      this.displayedColumns = ['name', 'iam', 'email'];
    }

    this.currentPage = 1;
  }

  public onSelect({ id }: ThingItem): void {
    this.thingId = id;
  }

  public onClose(): void {
    this.bsModalRef.hide();
  }

  private changeNameInputSub(): void {
    const nameInputSubscription = this.thingsFormGroup
      .get('byName')
      .valueChanges.pipe(
        debounceTime(1000),
        filter(value => value.length >= 3),
      )
      .subscribe(value => this.onChange(value));

    this.subscriptions.push(nameInputSubscription);
  }

  public onChange(value: string): void {
    this.searchInput = value;
    this.toggleDropDown();
  }

  public onChangeDocument(documentNumber: string): void {
    this.isLoading = true;
    this.thingId = '';

    if (documentNumber.length) {
      const sourceType = this.selectedType;
      let sourceValue = documentNumber;

      if (this.selectedType === 'CPF') {
        sourceValue = sourceValue.replace(/(\d{3})(\d)/, '$1.$2');
        sourceValue = sourceValue.replace(/(\d{3})(\d)/, '$1.$2');
        sourceValue = sourceValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      this.things$ = this.thingsService.getBySourceInfo(
        sourceType,
        sourceValue,
      );
      this.things$.subscribe(
        response => {
          this.isLoading = false;
          this.setThingsDataForTable(true, [response]);
        },
        error => {
          console.error(error);
          this.alertModalService.showAlertDanger(
            'A pessoa buscada não foi encontrada. Por favor, verifique os dados e tente novamente.',
          );
          this.isLoading = false;
          this.setThingsDataForTable(true);
        },
      );
    }
  }

  public singleAssociationPeriod(): void {
    this.disabled = true;
    this.isLoading = true;
    const device = this.createAssociationObject(this.singleExternalData);

    const { deviceId, applicationId } = device;

    this.applicationId = applicationId;
    this.deviceId = deviceId;
    this.associationPeriodsService.create(this.thingId, device).subscribe(
      data => {
        this.event.emit(data);
        this.onClose();

        this.loggingService.logEvent(
          `Portal TM - Realizou uma associação 
          do device de id: ${deviceId}, 
          da aplicação de id: ${applicationId},
          a thing de id: ${this.thingId}`,
          this.setupAssociationLogInfo(),
        );
        this.disabled = true;
        this.isLoading = false;
        this.alertService.showAlertSuccess(this.text.associateSucess);
      },
      error => {
        console.error(error);
        this.disabled = false;
        this.isLoading = false;

        if (error.status === 422) {
          this.alertService.showAlertDanger(this.text.errorAssociatingDevice);
        } else {
          this.alertService.showAlertDanger(this.text.associateErrorThing);
        }
      },
    );
  }

  public getByThingType(value: string): void {
    this.selectedType = value;

    switch (this.selectedType) {
      case 'Name':
        this.isEdit = false;
        this.placeholder = 'Inserir nome';
        break;
      case 'CPF':
        this.isEdit = false;
        this.placeholder = 'Inserir documento';
        break;
      case 'IAMID':
        this.isEdit = false;
        this.placeholder = 'Inserir documento';
        break;
      case 'PASSPORT':
        this.isEdit = false;
        this.placeholder = 'Inserir documento';
        break;
      default:
        this.isEdit = true;
        this.placeholder = '';
        break;
    }
  }

  public searchByName(value: string): void {
    this.thingId = '';
    this.isLoading = true;
    this.isLastSearchEmpty = false;

    if (value) {
      this.thingsService
        .getByName(value.trim(), 0, this.pageSize)
        .subscribe(({ things }) => {
          if (things.length) {
            this.setThingsDataForTable(true, things);
            this.isLoading = false;
          } else {
            this.alertService.showAlertDanger(
              'A pessoa buscada não foi encontrada. Por favor, verifique os dados e tente novamente.',
              '',
            );
            this.isLoading = false;
            this.setThingsDataForTable(true);
          }

          this.logEvent('Portal TM - Buscou por uma thing no modal de things');
        });
    }
    this.toggleDropDown();
  }

  public toggleDropDown(): void {
    this.showDropDown = false;
  }

  public onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight;
    const tableScrollHeight = e.target.scrollHeight;
    const scrollLocation = e.target.scrollTop;

    const buffer = 15;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (
      scrollLocation > limit &&
      !this.isWaitingForThingsReturn &&
      !this.isLastSearchEmpty
    ) {
      this.currentPage += 1;
      this.getMoreThingsFromScroll(this.currentPage);
    }
  }

  public getMoreThingsFromScroll(value: number): void {
    const skip = value > 1 ? (value - 1) * this.pageSize : 0;
    this.isWaitingForThingsReturn = true;

    if (this.searchInput) {
      this.getThingByName(this.searchInput, skip, this.pageSize);
    } else {
      this.getThings(skip, this.pageSize);
    }
  }

  private setThingsDataForTable(clearTableData: boolean, things?: ThingItem[]) {
    if (clearTableData) {
      this.thingsForTable = [];
      this.currentPage = 1;
    }
    things.forEach(thing => {
      this.setSourceInfoVariables(thing);
    });

    this.allThingsList = this.allThingsList.concat(things);
  }

  private setSourceInfoVariables(thing) {
    const thingWithSourceInfo = {
      name: thing.name,
      id: thing.id,
      cpf: '-',
      passport: '-',
      email: '-',
      status: thing.status,
      iam: '-',
    };

    thing.sourceInfos.forEach(sourceInfo => {
      switch (sourceInfo.type.toLowerCase()) {
        case SourceInfos.CPF:
          thingWithSourceInfo.cpf = sourceInfo.value;
          break;
        case SourceInfos.Passport:
          thingWithSourceInfo.passport = sourceInfo.value;
          break;
        case SourceInfos.Email:
          thingWithSourceInfo.email = sourceInfo.value;
          break;
        case SourceInfos.IAMID:
          thingWithSourceInfo.iam = sourceInfo.value;
          break;
        default:
          break;
      }
    });

    this.thingsForTable = this.thingsForTable.concat(thingWithSourceInfo);
  }

  private getThings(skip: number, count: number): void {
    this.thingsService.getAll(skip, count).subscribe(
      (response: any) => {
        this.setThingsDataForTable(false, response.things);
      },
      error => {
        this.loggingService.logException(error, SeverityLevel.Warning);
        this.alertService.showAlertDanger(
          'Algo de errado aconteceu',
          'Por favor entre em contato com o administrador.',
        );
      },
    );
  }

  private getThingByName(term: string, skip: number, count: number): void {
    this.things$ = this.thingsService.getByName(term, skip, count);
    this.things$.subscribe(({ things }: Things) => {
      if (things.length) {
        this.setThingsDataForTable(false, things);
        this.isLastSearchEmpty = false;
      } else {
        this.isLastSearchEmpty = true;
      }
      this.isWaitingForThingsReturn = false;
    });
  }

  private createAssociationObject(data: DeviceThingAssociation) {
    return {
      associationDate: new Date().toISOString(),
      applicationId: data.device.applicationId,
      deviceId: data.device.id,
      screen: data.screen,
    };
  }

  private setupAssociationLogInfo() {
    return {
      User: this.authService.getUserInfo().UserFullName,
      UserName: this.authService.getUserInfo().mail,
      applicationId: this.applicationId,
      deviceId: this.deviceId,
      thingId: this.thingId,
    };
  }

  private logEvent(message: string) {
    const properties = this.getUserProperties();
    this.loggingService.logEvent(message, properties);
  }

  private getUserProperties() {
    return {
      User: this.authService.getUserInfo().UserFullName,
      UserName: this.authService.getUserInfo().mail,
    };
  }

  public getStatusById(id: string): boolean {
    const thing = this.thingsForTable.find(x => x.id === id);
    return thing ? thing.status : false; // se não encontrar a coisa, retorna false
  }

  public openReactivationSubscriptionDialog() {
    const modal = this.dialog.open(ReactivateSubscriptionModalComponent, {
      data: {
        message: 'DEVICE_LIST.REACTIVATION_MESSAGE',
      },
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.disabled = true;
        this.isLoading = true;
        this.reactivateThingAndAssociation();
      }
    });
  }

  public reactivateThingAndAssociation(): void {
    const thingToBeUpdated = this.allThingsList.find(
      x => x.id === this.thingId,
    );
    this.thingsService
      .reactivateThing(thingToBeUpdated.id, thingToBeUpdated)
      .subscribe(
        response => {
          this.singleAssociationPeriod();
        },
        error => {
          const errorMessage = this.translate.instant(
            'DEVICE_LIST.REACTIVATION_ERROR_MESSAGE',
          );
          this.alertModalService.showAlertDanger(errorMessage);
          this.disabled = false;
          this.isLoading = false;
          this.thingId = '';
        },
      );
  }
}
