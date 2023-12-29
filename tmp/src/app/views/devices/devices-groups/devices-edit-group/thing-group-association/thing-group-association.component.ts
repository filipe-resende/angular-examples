import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DocumentType } from 'src/app/core/constants/document-type.const';
import {
  ThingItem,
  ThingWithSourceInfos,
  Things,
} from 'src/app/model/things-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThingsService } from 'src/app/services/factories/things.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { SourceInfos } from 'src/app/shared/enums/sourceInfo.enum';
import { DocumentOption } from 'src/app/shared/interfaces/documents-type-interface';

@Component({
  selector: 'app-things-group-association',
  templateUrl: './thing-group-association.component.html',
  styleUrls: ['./thing-group-association.component.scss'],
})
export class ThingGroupAssociationComponent implements OnInit {
  public typeOptions: DocumentOption[] = [
    { name: 'Name', value: 'NOME' },
    { name: 'CPF', value: 'CPF' },
    { name: 'IAMID', value: 'IAMID' },
    { name: 'PASSPORT', value: 'Passaporte' },
  ];

  public tableColumns: string[] = [
    'name',
    'cpf',
    'passport',
    'iam',
    'status',
    'email',
  ];

  public thingsFormGroup: FormGroup;

  public selectedType = '';

  public thing: ThingItem;

  public placeholder = '';

  public isEdit = true;

  public disabled = false;

  public searchInput = '';

  public isLoading = false;

  public subscriptions: Subscription[] = [];

  public isLastSearchEmpty = false;

  private currentPage = 1;

  public thingsForTable: ThingWithSourceInfos[] = [];

  private pageSize = 10;

  private isWaitingForThingsReturn = false;

  private privateSourceValue: string;

  public event = new EventEmitter<ThingItem>();

  public get sourceValue(): string {
    return this.privateSourceValue;
  }

  public set sourceValue(value: string) {
    this.privateSourceValue = value;
    if (!this.sourceValue) this.getListThings(0, 5);
  }

  public things$: Observable<any>;

  constructor(
    private bsModalRef: BsModalRef,
    private thingsService: ThingsService,
    private alertService: AlertModalService,
    private authService: AuthService,
    private loggingService: LoggingService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
  ) {
    this.thingsFormGroup = this.formBuilder.group({
      byThingName: '',
    });
  }

  public ngOnInit(): void {
    this.changeNameInputSub();
  }

  private changeNameInputSub(): void {
    const nameInputSubscription = this.thingsFormGroup
      .get('byThingName')
      .valueChanges.pipe(
        debounceTime(1000),
        filter(value => value.length >= 3),
      )
      .subscribe(value => this.onChange(value));

    this.subscriptions.push(nameInputSubscription);
  }

  public onChange(value: string): void {
    this.searchInput = value;
  }

  public onClose(): void {
    this.bsModalRef.hide();
  }

  public getThingByType(value: string): void {
    this.selectedType = value;

    switch (this.selectedType) {
      case 'Name':
        this.isEdit = false;
        this.placeholder = 'Inserir nome';
        break;
      case 'CPF':
      case 'IAMID':
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

  private getListThings(skip: number, count: number): void {
    this.thingsService.getAll(skip, count).subscribe(
      (response: any) => {
        this.setThingsDataForTable(false, response.things);
      },
      error => {
        const errorMessage = this.translate.instant(
          'EDIT_DEVICE_GROUP.MODAL_SELECT_THING.ERROR',
        );
        this.alertService.showAlertDanger(
          errorMessage.TITLE,
          errorMessage.SUBTITLE,
        );
        this.loggingService.logException(error, SeverityLevel.Warning);
      },
    );
  }

  public searchByName(value: string): void {
    if (!value) {
      return;
    }

    this.isLoading = true;
    this.isLastSearchEmpty = false;

    this.thingsService
      .getByName(value.trim(), 0, this.pageSize)
      .subscribe(({ things }) => {
        if (things.length) {
          this.setThingsDataForTable(true, things);
        } else {
          const message = this.translate.instant(
            'EDIT_DEVICE_GROUP.MODAL_SELECT_THING.ERROR.NOT_FOUND_THING',
          );
          this.alertService.showAlertDanger(message);
          this.setThingsDataForTable(true);
        }
        this.isLoading = false;
        this.logEvent('Portal TM - Buscou por uma thing no modal de things');
      });
  }

  private setThingsDataForTable(clearTableData: boolean, things?: ThingItem[]) {
    if (clearTableData) {
      this.thingsForTable = [];
      this.currentPage = 1;
    }
    things.forEach(thing => {
      this.setSourceInfoVariables(thing);
    });
  }

  private setSourceInfoVariables(thing: ThingItem) {
    const thingWithSourceInfo = {
      name: thing.name,
      id: thing.id,
      cpf: '-',
      passport: '-',
      email: '-',
      iam: '-',
      status: thing.status,
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
      }
    });

    this.thingsForTable = this.thingsForTable.concat(thingWithSourceInfo);
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

  public onChangeDocument(documentNumber: string): void {
    this.isLoading = true;

    if (documentNumber.length) {
      const sourceType = this.selectedType;
      let sourceValue = documentNumber;

      if (this.selectedType === DocumentType.CPF) {
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
          const message = this.translate.instant(
            'EDIT_DEVICE_GROUP.MODAL_SELECT_THING.ERROR.NOT_FOUND_THING',
          );
          this.alertService.showAlertDanger(message);
          this.isLoading = false;
          this.setThingsDataForTable(true);
        },
      );
    }
  }

  public onTableScroll(e): void {
    const tableHeight = e.target.offsetHeight;
    const tableScrollHeight = e.target.scrollHeight;
    const scrollPosition = e.target.scrollTop;

    const buffer = 15;
    const limit = tableScrollHeight - tableHeight - buffer;

    if (
      scrollPosition > limit &&
      !this.isWaitingForThingsReturn &&
      !this.isLastSearchEmpty
    ) {
      this.currentPage += 1;
      this.getMoreThingsOnScroll(this.currentPage);
    }
  }

  public getMoreThingsOnScroll(value: number): void {
    const skip = value > 1 ? (value - 1) * this.pageSize : 0;
    this.isWaitingForThingsReturn = true;

    if (this.searchInput) {
      this.getThingByName(this.searchInput, skip, this.pageSize);
    } else {
      this.getListThings(skip, this.pageSize);
    }
  }

  public onSelectThing(thing: ThingItem): void {
    this.thing = thing;
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

  public selectThing(): void {
    this.disabled = true;
    this.event.emit(this.thing);
    this.onClose();
  }
}
