import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, skip, tap } from 'rxjs/operators';
import { FeatureFlags } from 'src/app/core/constants/feature-flags.const';
import { ThingItem } from 'src/app/model/things-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { FeatureFlagsStateService } from 'src/app/stores/feature-flags/feature-flags-state.service';
import { ThingStateService } from 'src/app/stores/things/things-state.service';
import { Paginator } from '../../../model/paginator';

@Component({
  selector: 'app-things-home',
  templateUrl: './things-home.component.html',
  styleUrls: ['./things-home.component.scss'],
})
export class ThingsHomeComponent implements OnInit, OnDestroy {
  public thingsFormGroup: FormGroup;

  public subscriptions: Subscription[] = [];

  public paginator: Paginator = { skip: 0, currentPage: 1, pageSize: 10 };

  public things$: Observable<ThingItem[]>;

  public allThings$: Observable<ThingItem[]>;

  public totalCount$: Observable<number>;

  public error$: Observable<Error>;

  public paginator$: Observable<Paginator>;

  public userProperties: { [key: string]: string };

  public text: { [key: string]: string } = {};

  public selectedThingByName$: Observable<ThingItem[]>;

  public showSpinner = false;

  public placeholder = '';

  public things: ThingItem[] = [];

  public searchInput = '';

  public showDropDown = false;

  public selectedType = '';

  public isEdit = true;

  public filterOn = false;

  public error = false;

  public showDeviceGroupRestrictionDisclaimer = false;

  public typeOptions = [
    { name: 'Name', value: 'NOME' },
    { name: 'CPF', value: 'CPF' },
    { name: 'IAMID', value: 'IAMID' },
    { name: 'PASSPORT', value: 'Passaporte' },
  ];

  private sourceValueDocument: string;

  public get sourceValue(): string {
    return this.sourceValueDocument;
  }

  public set sourceValue(value: string) {
    this.sourceValueDocument = value;
  }

  constructor(
    private loggingService: LoggingService,
    private activatedRoute: ActivatedRoute,
    private alertModalService: AlertModalService,
    private thingsStateService: ThingStateService,
    private fb: FormBuilder,
    private featureFlagsStateService: FeatureFlagsStateService,
    private authService: AuthService,
  ) {
    this.thingsFormGroup = this.fb.group({
      byName: ['', Validators.required],
      byDocument: this.fb.group({ document: ['', Validators.required] }),
    });
  }

  public ngOnInit(): void {
    this.thingsFormGroup.reset();
    this.allThings$ = this.thingsStateService.allThings$;
    this.totalCount$ = this.thingsStateService.totalCount$;
    this.selectedThingByName$ = this.thingsStateService.selectedThingByName$;

    this.setupErrorSubscription();

    this.setupFilterByNameSub();
    this.changeNameInputSub();
    this.logUserNavigationToThisPage();
    this.loadData();
    this.verifyIfDisclaimersShouldBeShown();
  }

  private verifyIfDisclaimersShouldBeShown() {
    this.featureFlagsStateService.featureFlags$.subscribe(
      featureFlagResponse => {
        this.showDeviceGroupRestrictionDisclaimer =
          featureFlagResponse.find(
            featureFlag =>
              featureFlag.name === FeatureFlags.IsSecurityInfoDisclaimerEnabled,
          )?.value &&
          this.authService.getUserInfo().role !== Roles.Administrador;
      },
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  public onPaginate(value: number): void {
    this.showSpinner = true;

    const paginator = {
      ...this.paginator,
      skip: value > 1 ? (value - 1) * 10 : 0,
      currentPage: value,
    };

    const thingName = this.thingsFormGroup.get('byName').value || null;
    this.search(paginator, thingName);
  }

  private search(paginator?: Paginator, name?: string) {
    const { skip: skipPages } = paginator;
    if (!name) return this.thingsStateService.onPaginate(paginator);

    return this.thingsStateService.onSelectThingByName(name, skipPages, 10);
  }

  public getByThingType(value: string): void {
    this.selectedType = value;
    this.thingsFormGroup.controls.byDocument.get('document').reset();

    switch (this.selectedType) {
      case 'Name':
        this.sourceValue = '';
        this.isEdit = false;
        this.placeholder = 'Inserir nome';
        this.thingsFormGroup.patchValue({ byName: '' });
        break;
      case 'CPF':
        this.sourceValue = '';
        this.isEdit = false;
        this.placeholder = 'Inserir cpf';
        this.thingsFormGroup.controls.byDocument.patchValue({ document: '' });
        break;
      case 'IAMID':
        this.sourceValue = '';
        this.isEdit = false;
        this.placeholder = 'Inserir documento';
        this.thingsFormGroup.controls.byDocument.patchValue({ document: '' });
        break;
      case 'PASSPORT':
        this.sourceValue = '';
        this.isEdit = false;
        this.placeholder = 'Inserir documento';
        this.thingsFormGroup.controls.byDocument.patchValue({ document: '' });
        break;
      default:
        this.sourceValue = '';
        this.isEdit = true;
        this.placeholder = '';
        this.thingsFormGroup.controls.byDocument.patchValue({ document: '' });
        this.thingsFormGroup.get('byName').patchValue({ name: '' });
        break;
    }
  }

  public searchByName(value: string): void {
    this.error = false;
    this.thingsStateService.onSelectThingByName(value, 0, 10);
    this.paginator.currentPage = 1;
    this.toggleDropDown();
    this.showSpinner = true;
    this.filterOn = false;
    this.things$ = this.setupThingsObservable();
  }

  public onSelectThing(name: string): void {
    this.thingsStateService.onSelectThingByName(name);
    this.thingsFormGroup.get('byName').setValue(name);
    this.toggleDropDown();
    this.filterOn = true;
  }

  public toggleDropDown(value?: boolean): void {
    this.showDropDown = value || false;
  }

  public onClearFilter(): void {
    this.thingsFormGroup.get('byName').patchValue('');
    this.thingsFormGroup.controls.byDocument.patchValue({ document: '' });
    this.filterOn = false;
  }

  private setupThingsObservable(): Observable<ThingItem[]> {
    return this.thingsStateService.things$.pipe(
      skip(1),
      tap(things => {
        if (!things.length) {
          this.error = true;
          this.alertModalService.showAlertDanger(
            'A pessoa buscada não foi encontrada. Por favor, verifique os dados e tente novamente.',
          );
        } else {
          this.error = false;
        }
        this.showSpinner = false;
      }),
      filter(things => things.length > 0),
    );
  }

  private setupErrorSubscription() {
    const errorSub = this.thingsStateService.error$
      .pipe(
        filter(err => !!err),
        tap(() => {
          this.alertModalService.showAlertDanger(
            'A pessoa buscada não foi encontrada. Por favor, verifique os dados e tente novamente.',
          );
        }),
      )
      .subscribe(() => this.thingsStateService.onClearError());

    this.subscriptions.push(errorSub);
  }

  private filterValuesToAutoComplete(searchTerm: string): void {
    this.searchInput = searchTerm;

    if (searchTerm?.length) {
      this.thingsStateService.updateNameFilter(searchTerm);
    }

    if (this.searchInput?.length >= 3) {
      this.thingsStateService.onGetThingByName(this.searchInput.trim(), 0, 15);
      this.showDropDown = true;
    } else {
      this.thingsStateService.onClearThingsPreviewList();
    }

    if (!this.searchInput?.length) {
      this.resetView();
    }
  }

  private changeNameInputSub(): void {
    const nameInputSubscription = this.thingsFormGroup
      .get('byName')
      .valueChanges.pipe(
        debounceTime(1000),
        filter(value => value.length >= 3),
      )
      .subscribe(value => this.filterValuesToAutoComplete(value));

    this.subscriptions.push(nameInputSubscription);
  }

  private setupFilterByNameSub(): void {
    const byNameSub = this.thingsStateService.byNameFilter$.subscribe(
      (name: string) => this.thingsFormGroup.get('byName').patchValue(name),
    );

    this.subscriptions.push(byNameSub);
  }

  private loadData(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.thingName) {
        this.thingsStateService.onSelectThingByName(params.thingName);
      }
    });
  }

  private resetView(): void {
    this.paginator.currentPage = 1;
    this.toggleDropDown();
    this.thingsStateService.getThings(0, 10);
    this.thingsFormGroup.get('byName').reset();
  }

  private logUserNavigationToThisPage(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para home de things',
    );
  }

  public onChangeDocument(sourceValue: string): void {
    if (sourceValue.length) {
      this.getThingBySourceInfo(sourceValue);
    }
  }

  private getThingBySourceInfo(sourceValue: string) {
    this.filterOn = true;
    this.thingsStateService.onGetThingBySourceInfo(
      this.selectedType,
      sourceValue,
    );
    this.things$ = this.setupThingsObservable();
  }
}
