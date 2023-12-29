import {
  Component,
  ElementRef,
  OnInit,
  Type,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { filter } from 'rxjs/operators';
import { FlightsService } from '../../stores/flights/flights.service';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';

import { OverlayService } from '../../core/services/overlay.service';
import { ExcelService } from '../../core/services/excel-service/excel.service';

import { FlightOrGateEventType } from '../../shared/enums/flightsAndGates';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import {
  formatDate,
  formatDateAsUTC,
  getHoursString,
  getMinutesString
} from '../../shared/utils/date';

import { OverlayExporterComponent } from '../../components/presentational/overlay-exporter/overlay-exporter.component';
import { ExportationTypes } from '../../shared/enums/ExportationTypes';
import { PaginatedList } from '../../shared/models/paginated-list';
import { Flights } from '../../shared/models/flights';
import { Direction, FlightType } from './constants';

@Component({
  selector: 'app-flights-page',
  templateUrl: './flights-and-gates.page.html',
  styleUrls: ['./flights-and-gates.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlightsAndGatesPage implements OnInit {
  // #region [PROPERTIES]
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  public displayedColumns: string[] = [
    'icons',
    'type',
    'flight',
    'originDestiny',
    'direction',
    'peopleCount',
    'lastReport'
  ];

  public FlightType = FlightType;

  public Direction = Direction;

  public dataSource: MatTableDataSource<Flights>;

  public transportsList: Flights[] = [];

  public ngForm: FormGroup;

  public appliedTypeFilter: string;

  public appliedFlightNumberFilter: string;

  public startDate;

  public endDate;

  public maxCalendarDate;

  public hasAppliedFilter: boolean;

  public paginator: Paginator = { page: 1, perPage: 10, total: 0 };

  public isFetching: boolean;

  public skeletonArray = Array(10);

  public exportOverlayRef;

  public flightsAndGatesDirectionsOptions = [];

  public eventTypesOptions = [];

  public flights$: Observable<PaginatedList<Flights>>;

  private subscriptions: Subscription[] = [];

  // #endregion
  constructor(
    private flightsService: FlightsService,
    private breadcrumbService: BreadcrumbService,
    private overlayService: OverlayService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private excelService: ExcelService
  ) {
    this.ngForm = this.fb.group({
      typeSelected: [null],
      flightNumberSelected: [null],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required]
    });
  }

  public ngOnInit(): void {
    this.flights$ = this.flightsService.flights$;

    this.exportOverlayRef = this.overlayService.create();

    this.setupBreadcrumb();
    this.setupDirectionFilterOptions();
    this.setupEventTypeFilterOptions();

    this.setupFiltersInitialValues();
    this.onFlightsListsPaginatedChangeHandler();
    this.flightsService.counters$.pipe(filter(x => !!x)).subscribe(() => {
      this.flightsService.updateIsFetchingCountersState(false);
    });
  }

  public async ngOnDestroy(): Promise<void> {
    this.tearDownBreadcrumb();

    if (this.subscriptions) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }
  }

  public areFormDatetimesIntervalValid(): boolean {
    return this.startDate && this.endDate && this.ngForm.valid;
  }

  public formatDateAsUTC(date: string | Date): string {
    return formatDateAsUTC(date);
  }

  public onApplyFilterButtonClick(): void {
    this.appliedTypeFilter = this.ngForm.value.typeSelected;
    this.appliedFlightNumberFilter = this.ngForm.value.flightNumberSelected;

    this.search(
      this.ngForm.value.typeSelected && this.ngForm.value.typeSelected.value,
      this.ngForm.value.flightNumberSelected
    );
  }

  public onSelectDate({ value: date }, type: 'startDate' | 'endDate') {
    if (type === 'startDate') {
      this.startDate = formatDate(date);
    }

    if (type === 'endDate') {
      this.endDate = formatDate(date);

      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.startDate = this.endDate;
      }

      this.maxCalendarDate = date;
    }

    const startDate = new Date(
      formatDateAsUTC(this.endDate, this.ngForm.value.startHour)
    );
    const endDate = new Date(
      formatDateAsUTC(this.endDate, this.ngForm.value.endHour)
    );
    const todayDate = new Date();

    if (startDate > todayDate) {
      this.ngForm.controls.startHour.setValue(
        `${getHoursString(todayDate)}:${getMinutesString(todayDate)}`
      );
    }

    if (endDate > todayDate) {
      this.ngForm.controls.endHour.setValue(
        `${getHoursString(todayDate)}:${getMinutesString(todayDate)}`
      );
    }

    if (this.areFormDatetimesIntervalValid()) {
      this.search();
      this.clearSearchFilter();
    }
  }

  public onSelectHour(
    { target: { value } },
    type: 'startHour' | 'endHour'
  ): void {
    const selectedDate = new Date(
      formatDateAsUTC(
        type === 'startHour' ? this.startDate : this.endDate,
        value
      )
    );
    const todayDate = new Date();

    if (selectedDate > todayDate) {
      this.ngForm.controls[type].setValue(
        `${getHoursString(todayDate)}:${getMinutesString(todayDate)}`
      );
    } else {
      this.ngForm.controls[type].setValue(
        `${getHoursString(selectedDate)}:${getMinutesString(selectedDate)}`
      );
    }

    if (
      new Date(this.startDate) >= new Date(this.endDate) &&
      new Date(`2000-01-01T${this.ngForm.value.startHour}`) >
        new Date(`2000-01-01T${this.ngForm.value.endHour}`)
    ) {
      this.ngForm.controls.startHour.setValue(this.ngForm.value.endHour);
    }

    if (this.areFormDatetimesIntervalValid()) {
      this.search();
      this.clearSearchFilter();
    }
  }

  public onClearSearchButtonClick(): void {
    this.appliedTypeFilter = null;
    this.appliedFlightNumberFilter = null;
    this.flightsService.unsubscribeAll();
    this.clearSearchFilter();
    this.search();
  }

  public onExportExcelButtonClick(
    buttonElementRef: ElementRef<HTMLButtonElement>
  ): void {
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
          periodFrom: formatDateAsUTC(
            this.startDate,
            this.ngForm.value.startHour
          ),
          periodTo: formatDateAsUTC(this.endDate, this.ngForm.value.endHour)
        },
        exportCallback:
          this.excelService.exportFlightsAndGatesAsExcelToLoggedUserEmail.bind(
            this.excelService
          ),
        modalType: ExportationTypes.DisplacementPage
      }
    );
  }

  public onChangePage(paginatorUpdated: Paginator): void {
    this.paginator = paginatorUpdated;

    const from = formatDateAsUTC(this.startDate, this.ngForm.value.startHour);
    const to = formatDateAsUTC(this.endDate, this.ngForm.value.endHour);

    this.getFlights(from, to);
  }

  public async onOpenTripThingsListIconClick({
    direction,
    type,
    flight,
    airport,
    numberOfPassengers,
    latestReportTime
  }): Promise<void> {
    const from = formatDateAsUTC(
      this.startDate?.split('T')[0],
      this.ngForm.value.startHour
    );
    const to = formatDateAsUTC(
      this.endDate?.split('T')[0],
      this.ngForm.value.endHour
    );

    this.flightsService.updateSelectedFlightState({
      currentFlight: {
        flight,
        type,
        direction,
        airport,
        numberOfPassengers,
        latestReportTime
      },
      from,
      to,
      pageIndex: 1,
      pageSize: this.paginator.perPage
    });

    this.flightsService.updatePassengersState(null);

    this.flightsService.getPassengers(
      from,
      to,
      flight,
      airport,
      direction,
      type,
      this.paginator.perPage,
      1
    );

    this.router.navigateByUrl('/flights-and-gates/people');
  }

  private search(
    flightOrGate?: FlightOrGateEventType,
    flightNumber?: string
  ): void {
    this.hasAppliedFilter = true;
    this.paginator.total = 0;
    this.paginator.page = 1;

    const startDate = this.startDate.split('T')[0];
    const endDate = this.endDate.split('T')[0];

    const from = formatDateAsUTC(startDate, this.ngForm.value.startHour);
    const to = formatDateAsUTC(endDate, this.ngForm.value.endHour);

    if (from && to) {
      if (!flightOrGate && !flightNumber) {
        this.flightsService.updateIsFetchingCountersState(true);
        this.flightsService.getCounters(from, to);
      }

      this.getFlights(from, to, flightOrGate, flightNumber);
    }
  }

  private getFlights(
    from: string,
    to: string,
    flightOrGate?: FlightOrGateEventType,
    flightNumber?: string
  ) {
    try {
      this.isFetching = true;

      this.flightsService.getFlights(
        from,
        to,
        this.paginator.perPage,
        this.paginator.page,
        flightOrGate,
        flightNumber
      );
    } catch (error) {
      this.emptyTable();
      this.isFetching = false;
      this.flightsService.updateIsFetchingCountersState(false);
      this.flightsService.updateIsFetchingFlightsState(false);
    }
  }

  private clearSearchFilter(): void {
    this.ngForm.controls.typeSelected.setValue(null);
    this.ngForm.controls.flightNumberSelected.setValue(null);
  }

  private emptyTable(): void {
    this.transportsList = [];
    this.dataSource = null;
    this.paginator.total = 0;
    this.paginator.page = 1;
    this.isFetching = false;
    this.maxCalendarDate = new Date();

    const emptyArray = Array(10);

    this.dataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        type: null,
        direction: '',
        numberOfPassengers: 0,
        latestReportTime: '',
        flight: '',
        airport: ''
      }))
    );
  }

  private onFlightsListsPaginatedChangeHandler(): void {
    const flightsList$ = this.flightsService.flights$
      .pipe(filter(x => !!x))
      .subscribe(
        (flightsList: PaginatedList<Flights>) => {
          this.dataSource = new MatTableDataSource(flightsList.items);
          this.dataSource.sort = this.sort;

          if (flightsList.totalCount === 0) {
            this.emptyTable();
          }

          this.isFetching = false;
        },
        () => {
          this.emptyTable();
          this.isFetching = false;
        }
      );

    if (flightsList$) {
      this.subscriptions.push(flightsList$);
    }
  }

  private setupFiltersInitialValues(): void {
    this.flightsService.selectedFlight$
      .pipe(filter(x => !!x))
      .subscribe(selectedFlight => {
        if (selectedFlight && selectedFlight.from && selectedFlight.to) {
          this.startDate = selectedFlight.from;
          this.endDate = selectedFlight.to;

          const fromAsDate = new Date(selectedFlight.from);
          const toAsDate = new Date(selectedFlight.to);

          this.ngForm.controls.startHour.setValue(
            `${getHoursString(fromAsDate)}:${getMinutesString(fromAsDate)}`
          );

          this.ngForm.controls.endHour.setValue(
            `${getHoursString(toAsDate)}:${getMinutesString(toAsDate)}`
          );
        }
      });
  }

  private setupDirectionFilterOptions(): void {
    this.translateService
      .get('FLIGHTS')
      .toPromise()
      .then(({ ENTERING, LEAVING, ARRIVAL, DEPARTURE }) => {
        this.flightsAndGatesDirectionsOptions = [
          {
            label: ENTERING,
            value: Direction.Entering
          },
          {
            label: LEAVING,
            value: Direction.Leaving
          },
          {
            label: ARRIVAL,
            value: Direction.Arrival
          },
          {
            label: DEPARTURE,
            value: Direction.Departure
          }
        ];
      });
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/flights-and-gates',
      text: 'BREADCRUMB.VOISEYS_BAY'
    });
  }

  private setupEventTypeFilterOptions(): void {
    this.translateService.get('FLIGHTS.TYPES').subscribe(({ FLIGHT, GATE }) => {
      this.eventTypesOptions = [
        {
          label: FLIGHT,
          value: 'flight'
        },
        {
          label: GATE,
          value: 'gate'
        }
      ];
    });
  }

  private tearDownBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(false);
    this.breadcrumbService.popBreadcrumbItem();
  }
}
