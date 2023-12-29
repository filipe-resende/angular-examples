import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, take, tap } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Site } from '../../shared/models/site';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import { HeaderService } from '../../stores/header/header.service';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';
import { SitesService } from '../../stores/sites/sites.service';
import { formatDate, formatDateAsUTC } from '../../shared/utils/date';
import { OverlayService } from '../../core/services/overlay.service';
import { TransportsService } from '../../stores/transports/transports.service';
import { PerimetersService } from '../../stores/perimeters/perimeters.service';
import { TransportsPaginatedList } from '../../stores/transports/transports.state';
import { Trip } from '../../shared/models/trip';
import { ExcelService } from '../../core/services/excel-service/excel.service';
import { OverlayExporterComponent } from '../../components/presentational/overlay-exporter/overlay-exporter.component';
import { NotificationService } from '../../components/presentational/notification/notification.service';

import { DisplacementPeopleOverlayComponent } from './displacement-people-overlay/displacement-people-overlay.component';
import { Extensions } from '../../shared/extensions';
import { Telemetry } from '../../shared/models/telemetry';
import { ExportationTypes } from '../../shared/enums/ExportationTypes';
import { ModalStatusComponent } from '../../components/presentational/modal-status/modal-status.component';

@Component({
  selector: 'app-displacement',
  templateUrl: './displacement.page.html',
  styleUrls: ['./displacement.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisplacementPage implements OnInit {
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  public dataSource: MatTableDataSource<Trip>;

  public displayedColumns: string[] = [
    'passagerIcon',
    'line',
    'telemetry',
    'code',
    'busPlate',
    'busCompany',
    'direction',
    'peopleInLineCount',
    'lastLocation',
    'eventDateTime',
    'startTripTime',
    'finalDateTrip',
    'initialPointLocation',
    'finalPointLocation'
  ];

  public transportsList: Trip[] = [];

  public transportsLinesOptions: string[] = [];

  public transportsDirectionsOptions = [];

  public transportsBySite: any[] = [];

  public name = new FormControl('', []);

  public ngForm: FormGroup;

  public ngFormPlateSearch: FormGroup;

  public startDateUTCForDatePicker: string;

  public endDateUTCForDatePicker: string;

  public exportOverlayRef;

  public currentDate: Date;

  public skeletonArray = Array(10);

  public paginator: Paginator = { page: 0, perPage: 10, total: 0 };

  public selectedSite: Site;

  public appliedLineFilter: string;

  public appliedDirectionFilter: string;

  public appliedPlateFilter: string;

  public sitesList$: Observable<Site[]>;

  public paginatedlinesList$: Observable<TransportsPaginatedList>;

  public telemetryCompanyNames$: Observable<{ label: string; value: string }[]>;

  public isFetching = false;

  public isLoadingExport = false;

  public hasAppliedFilter = false;

  public showDisclaimer = true;

  private subscriptions: Subscription[] = [];

  private overlayRef: OverlayRef;

  private emptyListWarning = new BehaviorSubject<boolean>(false);

  private emptyListWarning$ = this.emptyListWarning.asObservable();

  private telemetryCompanies: Telemetry[];

  public isTripSearch = true;

  // #endregion

  constructor(
    private notificationService: NotificationService,
    private breadcrumbService: BreadcrumbService,
    private fb: FormBuilder,
    private headerService: HeaderService,
    private sitesService: SitesService,
    private translate: TranslateService,
    private overlayService: OverlayService,
    private transportsService: TransportsService,
    private perimetersService: PerimetersService,
    private router: Router,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private siteService: SitesService
  ) {
    this.ngForm = this.fb.group({
      line: [null],
      direction: [null],
      plate: [null],
      sourceApplicationId: [null],
      telemetry: [''],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.ngFormPlateSearch = this.fb.group({
      plate: ['', Validators.required]
    });

    this.currentDate = new Date();
  }

  public ngOnInit(): void {
    this.transportsService.getTelemetryCompanies();

    this.paginatedlinesList$ = this.transportsService.transportsPaginatedList$;
    this.exportOverlayRef = this.overlayService.create();
    this.telemetryCompanyNames$ = this.setupTelemetryObservable();

    this.setupSearchbar();
    this.setupBreadcrumb();
    this.setupDirectionFilterOptions();

    this.onSelectedSiteChangeHandler();
    this.onSearchbarTextChangeHandler();
    this.onTransportsListsPaginatedChangeHandler();
    this.onAllTransportsNamesListsChangeHandler();

    this.setupTableFilters();
    this.exportOverlayRef = this.overlayService.create();
  }

  public ngOnDestroy(): void {
    try {
      this.perimetersService.syncPerimetersBySite(
        this.sitesService.getSelectedSite()
      );
    } finally {
      if (this.subscriptions) {
        this.subscriptions.forEach(s => s.unsubscribe());
      }

      this.tearDownSearchbar();
      this.tearDownBreadcrumb();
    }
  }

  getCurrentTime = (): string => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  private isEmptySelectedSite(): boolean {
    const selectedSite = this.siteService.getSelectedSite();
    return !selectedSite || Object.keys(selectedSite).length === 0;
  }

  public onSearchButtonClick(isTripSearch: boolean): void {
    let content;

    this.translate
      .get(`DEVICES.HTTP_ERROR_RESPONSES.SERVER_ERROR`)
      .subscribe(response => {
        content = response;
      });

    if (this.isEmptySelectedSite() && isTripSearch) {
      this.dialog.open(ModalStatusComponent, {
        data: {
          content
        }
      });
    } else {
      this.search(isTripSearch);
    }
  }

  public onExportExcelButtonClick(buttonElementRef: ElementRef): void {
    const {
      startDate,
      startHour,
      endDate,
      endHour,
      line,
      direction,
      plate,
      sourceApplicationId
    } = this.ngForm.value;

    this.overlayService.open<OverlayExporterComponent>(
      this.exportOverlayRef,
      buttonElementRef,
      OverlayExporterComponent,
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 30
      },
      {
        paramsObj: {
          periodFrom: formatDateAsUTC(formatDate(startDate), startHour),
          periodTo: formatDateAsUTC(formatDate(endDate), endHour),
          line,
          direction,
          plate,
          telemetry: sourceApplicationId
        },
        exportCallback:
          this.excelService.exportDisplacementsAsExcelToLoggedUserEmail.bind(
            this.excelService
          ),
        modalType: ExportationTypes.DisplacementPage
      }
    );
  }

  public onChangePage(paginatorUpdated: Paginator): void {
    this.paginator = paginatorUpdated;

    let {
      startDate,
      startHour,
      endDate,
      endHour,
      line,
      direction,
      sourceApplicationId
    } = this.ngForm.value;

    const { plate } = this.ngForm.value;

    if (!this.isTripSearch) {
      startDate = this.getThreeMonthsAgo();
      endDate = this.currentDate;
      startHour = this.getCurrentTime();
      endHour = this.getCurrentTime();
      line = null;
      direction = null;
      sourceApplicationId = null;
    }

    const from = formatDateAsUTC(formatDate(startDate), startHour);

    const till = formatDateAsUTC(formatDate(endDate), endHour);

    this.isFetching = true;
    this.transportsService
      .syncTransportsLinesPaginated(
        this.paginator.page,
        this.paginator.perPage,
        this.isTripSearch,
        from,
        till,
        line,
        direction,
        plate,
        sourceApplicationId
      )
      .catch(() => this.emptyTable())
      .finally(() => {
        this.isFetching = false;
      });
  }

  public onClearSearchButtonClick(): void {
    this.transportsService.resetRequests();
    this.clearSearchFilter();
  }

  public onSelectDirection({
    value: direction
  }: {
    [key: string]: string;
  }): void {
    this.ngForm.controls.direction.setValue(direction);

    this.transportsService.updateTransportFilter({
      direction
    });
  }

  public onSelectTelemetryCompany({
    value: telemetry
  }: {
    value: string;
  }): void {
    const sourceApplicationId = this.getCurrentSourceApplicationId(telemetry);

    this.ngForm.controls.telemetry.setValue(telemetry);
    this.ngForm.controls.sourceApplicationId.setValue(sourceApplicationId);

    this.transportsService.updateTransportFilter({
      telemetry,
      sourceApplicationId
    });
  }

  public onOpenTripThingsListIconClick(tripSelect: Trip): void {
    const from = formatDateAsUTC(
      this.ngForm.value.startDate,
      this.ngForm.value.startHour
    );
    const till = formatDateAsUTC(
      this.ngForm.value.endDate,
      this.ngForm.value.endHour
    );

    this.openDisplacementPeopleOverlay(tripSelect, from, till);
  }

  public onOpenTripMapDetails(): void {
    this.router.navigateByUrl('/displacement-new/map');
  }

  public onStartDateChange({
    value: date
  }: MatDatepickerInputEvent<string | Date>): void {
    this.ngForm.controls.startDate.setValue(date);
    this.startDateUTCForDatePicker = formatDateAsUTC(date);

    this.transportsService.updateTransportFilter({
      startDate: this.ngForm.value.startDate
    });
  }

  public onEndDateChange({
    value: date
  }: MatDatepickerInputEvent<string | Date>): void {
    this.ngForm.controls.endDate.setValue(date);
    this.endDateUTCForDatePicker = formatDateAsUTC(date);

    this.transportsService.updateTransportFilter({
      endDate: this.ngForm.value.endDate
    });
  }

  public onChangeLine(lineName: string): void {
    this.ngForm.controls.line.setValue(lineName);
    this.transportsService.updateTransportFilter({
      lineName
    });
  }

  public onChangePlate(plate: string): void {
    this.ngForm.controls.plate.setValue(plate);
    this.ngFormPlateSearch.controls.plate.setValue(plate);
    this.transportsService.updateTransportFilter({
      plate
    });
  }

  public onSelectStartHour(hour: string): void {
    this.ngForm.controls.startHour.setValue(hour);
    this.transportsService.updateTransportFilter({ startHour: hour });
  }

  public onSelectEndHour(hour: string): void {
    this.ngForm.controls.endHour.setValue(hour);
    this.transportsService.updateTransportFilter({ endHour: hour });
  }

  public onSiteSelect(site: Site): void {
    this.sitesService.updateSelectedSiteModel({ site });
  }

  private applyFilter(filterValue: string): void {
    if (this.dataSource) {
      if (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.dataSource.filter = '';
      }
    }
  }

  private clearSearchFilter(): void {
    this.appliedLineFilter = null;
    this.appliedDirectionFilter = null;
    this.appliedPlateFilter = null;
    this.startDateUTCForDatePicker = null;
    this.endDateUTCForDatePicker = null;

    this.ngForm.controls.line.setValue(null);
    this.ngForm.controls.telemetry.setValue(null);
    this.ngForm.controls.direction.setValue(null);
    this.ngForm.controls.plate.setValue(null);
    this.ngForm.controls.startDate.setValue(null);
    this.ngForm.controls.endDate.setValue(null);
    this.ngForm.controls.startHour.setValue(null);
    this.ngForm.controls.endHour.setValue(null);
    this.ngForm.controls.sourceApplicationId.setValue(null);
  }

  private emptyTable(): void {
    this.transportsList = [];
    this.dataSource = null;
    this.paginator.total = 0;
    this.paginator.page = 0;
    this.isFetching = false;

    const emptyArray = Array(10);

    this.dataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        code: null,
        line: null,
        busCompany: null,
        displayName: null,
        lastLocation: null,
        eventDateTime: null,
        direction: null,
        category: null,
        peopleInLineCount: null,
        initialPointLocation: null,
        finalPointLocation: null,
        startTripTime: null,
        finalDateTrip: null,
        telemetry: null
      }))
    );
  }

  private onAllTransportsNamesListsChangeHandler(): void {
    const transportsList$ =
      this.transportsService.transportsNamesList$.subscribe(linesNames => {
        const linesGroupedByCode = _.groupBy(linesNames, 'line');

        this.transportsLinesOptions = _.map(
          linesGroupedByCode,
          (group, line) => line
        );
      });
    this.subscriptions.push(transportsList$);
  }

  private onSearchbarTextChangeHandler(): void {
    const searchbarText$ = this.headerService.searchbar$.subscribe(
      ({ text }) => {
        this.applyFilter(text);
      }
    );
    this.subscriptions.push(searchbarText$);
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        if (selectedSite) {
          this.selectedSite = selectedSite;
          this.hasAppliedFilter = false;
        }
      }
    );
    this.subscriptions.push(selectedSite$);
  }

  private onTransportsListsPaginatedChangeHandler(): void {
    const transportsList$ = combineLatest([
      this.emptyListWarning$,
      this.transportsService.transportsPaginatedList$
    ])
      .pipe(
        tap(([, { list }]) => {
          if (!list.length) {
            this.emptyTable();
            this.paginator.total = 0;
            this.paginator.page = 0;
          }
        })
      )
      .subscribe(([warning, { list, totalCount }]) => {
        if (warning && !list.length) {
          this.setupWarningNotifications();
          this.emptyListWarning.next(false);
        }
        this.paginator.total = totalCount;

        if (list.length) {
          this.transportsList = list;
          this.dataSource = new MatTableDataSource(this.transportsList);
          this.dataSource.filterPredicate = this.tableFilterSetting();
          this.dataSource.sort = this.sort;
        }
      });

    this.subscriptions.push(transportsList$);
  }

  public getThreeMonthsAgo(): Date {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    return currentDate;
  }

  private search(isTripSearch: boolean): void {
    this.hasAppliedFilter = true;
    this.paginator.total = 0;
    this.paginator.page = 1;

    let {
      startDate,
      startHour,
      endDate,
      endHour,
      line,
      direction,
      sourceApplicationId
    } = this.ngForm.value;

    const { plate } = this.ngForm.value;

    if (!isTripSearch) {
      startDate = this.getThreeMonthsAgo();
      endDate = this.currentDate;
      startHour = this.getCurrentTime();
      endHour = this.getCurrentTime();
      line = null;
      direction = null;
      sourceApplicationId = null;
    }

    const from = formatDateAsUTC(formatDate(startDate), startHour);
    const till = formatDateAsUTC(formatDate(endDate), endHour);

    if (from && till) {
      this.isFetching = true;
      this.transportsService
        .syncTransportsLinesPaginated(
          this.paginator.page,
          this.paginator.perPage,
          isTripSearch,
          from,
          till,
          line,
          direction,
          plate,
          sourceApplicationId
        )
        .then(() => this.emptyListWarning.next(true))
        .catch(() => this.emptyTable())
        .finally(() => {
          this.isFetching = false;
        });
    }
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/displacement-new',
      text: 'DISPLACEMENTS.BUS'
    });
  }

  private setupDirectionFilterOptions(): void {
    this.translate
      .get('DISPLACEMENT')
      .toPromise()
      .then(({ TO_VALE, FROM_VALE, CIRCULAR }) => {
        this.transportsDirectionsOptions = [
          {
            label: TO_VALE,
            value: 'toVale'
          },
          {
            label: FROM_VALE,
            value: 'fromVale'
          },
          {
            label: CIRCULAR,
            value: 'circular'
          }
        ];
      });
  }

  private setupSearchbar(): void {
    this.headerService.updateSearchbar({
      isVisible: false,
      placeholder: 'DISPLACEMENT.BADGE_IAM_ID_LINE'
    });
  }

  private tableFilterSetting(): (data: any, filter: string) => boolean {
    const filterFunction = (data, filter): boolean => {
      return (
        (data.document && data.document.toLowerCase().indexOf(filter)) !== -1 ||
        (data.name && data.name.toString().toLowerCase().indexOf(filter)) !==
          -1 ||
        (data.networkKey &&
          data.networkKey.toString().toLowerCase().indexOf(filter)) !== -1
      );
    };
    return filterFunction;
  }

  private tearDownBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(false);
    this.breadcrumbService.popBreadcrumbItem();
  }

  private tearDownSearchbar(): void {
    this.headerService.updateSearchbarVisibilityTo(false);
  }

  private setupWarningNotifications(): void {
    this.translate
      .get('DISPLACEMENT')
      .pipe(take(1))
      .subscribe(({ NO_CONTENT }) =>
        this.notificationService.warning(NO_CONTENT, false, 3000)
      );
  }

  private openDisplacementPeopleOverlay(
    trip: Trip,
    from: string,
    till: string
  ): void {
    this.dialog.open(DisplacementPeopleOverlayComponent, {
      disableClose: true,
      width: Extensions.isMobile.any() ? '100%' : 'auto',
      data: { trip, from, till }
    });

    this.closeOverlay();
  }

  private closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private setupTelemetryObservable(): Observable<
    { label: string; value: string }[]
  > {
    return this.transportsService.telemetryCompanies$.pipe(
      tap(telemetryCompanies => {
        this.telemetryCompanies = telemetryCompanies;
      }),
      map(telemetryComanies =>
        telemetryComanies.map(company => {
          return {
            label: company.name,
            value: company.name
          };
        })
      )
    );
  }

  private getCurrentSourceApplicationId(telemetry: string): string | null {
    const selectedTelemetryCompany = this.telemetryCompanies.find(
      ({ name }) => name === telemetry
    );

    return selectedTelemetryCompany
      ? selectedTelemetryCompany.sourceApplicationId
      : null;
  }

  private setupTableFilters(): void {
    this.transportsService.transportsFilter$
      .pipe(
        take(1),
        tap(
          ({
            startHour,
            startDate,
            endHour,
            endDate,
            plate,
            direction,
            lineName,
            telemetry,
            sourceApplicationId
          }) => {
            this.ngForm.controls.line.setValue(lineName);
            this.ngForm.controls.direction.setValue(direction);
            this.ngForm.controls.plate.setValue(plate);
            this.ngForm.controls.startDate.setValue(startDate);
            this.ngForm.controls.endDate.setValue(endDate);
            this.ngForm.controls.startHour.setValue(startHour);
            this.ngForm.controls.endHour.setValue(endHour);
            this.ngForm.controls.telemetry.setValue(telemetry);
            this.ngForm.controls.sourceApplicationId.setValue(
              sourceApplicationId
            );
          }
        )
      )
      .subscribe();
  }

  searchSwitch(enabled: boolean): void {
    this.isTripSearch = enabled;
  }
}
