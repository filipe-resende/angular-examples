import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Observable, Subscription } from 'rxjs';

import { filter } from 'rxjs/operators';
import { FlightsService } from '../../stores/flights/flights.service';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';
import { HeaderService } from '../../stores/header/header.service';

import {
  formatDateAsUTC,
  formatDate,
  getHoursString,
  getMinutesString
} from '../../shared/utils/date';
import { FlightOrGateEventType } from '../../shared/enums/flightsAndGates';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import { OverlayService } from '../../core/services/overlay.service';
import { ExcelService } from '../../core/services/excel-service/excel.service';

import { OverlayExporterComponent } from '../../components/presentational/overlay-exporter/overlay-exporter.component';
import { ExportationTypes } from '../../shared/enums/ExportationTypes';
import { FlightsPassengers } from '../../shared/models/flights-passangers';
import { SelectedFlight } from '../../stores/flights/flights.state';
import { PaginatedList } from '../../shared/models/paginated-list';

@Component({
  selector: 'app-flights-and-gates-people',
  templateUrl: './flights-and-gates-people.page.html',
  styleUrls: ['./flights-and-gates-people.page.scss']
})
export class FlightsAndGatesPeoplePage implements OnInit {
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  public dataSource: MatTableDataSource<FlightsPassengers>;

  public displayedColumns: string[] = [
    'id',
    'name',
    'role',
    'roleType',
    'department',
    'phone',
    'email'
  ];

  public isFetching = false;

  public subscriptions: Subscription[] = [];

  public selectedFlight$: Observable<SelectedFlight>;

  public passengers$: Observable<PaginatedList<FlightsPassengers>>;

  public ngForm: FormGroup;

  public startDate;

  public endDate;

  public maxCalendarDate: Date;

  public currentDate: Date;

  public paginator: Paginator = { page: 1, perPage: 10, total: 0 };

  public skeletonArray = Array(10);

  public exportOverlayRef;

  public peopleList: FlightsPassengers[];

  public isFetchingPassengers$: Observable<boolean>;

  constructor(
    private flightsService: FlightsService,
    private overlayService: OverlayService,
    private fb: FormBuilder,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private headerService: HeaderService,
    private excelService: ExcelService
  ) {
    this.ngForm = this.fb.group({
      startHour: ['', Validators.required],
      endHour: ['', Validators.required]
    });

    this.maxCalendarDate = new Date();
    this.currentDate = new Date();
  }

  public ngOnInit(): void {
    this.selectedFlight$ = this.flightsService.selectedFlight$;

    this.subscriptions.push(
      this.flightsService.isFetchingPassengers$.subscribe(isFetching => {
        this.isFetching = isFetching;
      })
    );

    const { selectedFlight } = this.flightsService.getStore();

    if (!selectedFlight) {
      this.router.navigateByUrl('/flights-and-gates');
    } else {
      this.exportOverlayRef = this.overlayService.create();

      this.passengers$ = this.flightsService.passengers$;
      this.isFetchingPassengers$ = this.flightsService.isFetchingPassengers$;

      this.emptyTable();

      this.setupSearchbar();
      this.setupDatesInitialValues();
      this.setupBreadcrumb();

      this.onSearchbarTextChangeHandler();
      this.onFlightsAndGatesThingsHandler();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    this.tearDownBreadcrumb();
    this.tearDownSearchbar();
  }

  public formatDateAsUTC(date: string | Date) {
    return formatDateAsUTC(date);
  }

  public async onApplyFilterButtonClick() {
    const from = formatDateAsUTC(this.startDate, this.ngForm.value.startHour);
    const to = formatDateAsUTC(this.endDate, this.ngForm.value.endHour);

    const { selectedFlight } = this.flightsService.getStore();

    const newSelectedFlight = { ...selectedFlight, from, to };

    this.flightsService.updateSelectedFlightState({
      ...newSelectedFlight,
      pageSize: this.paginator.perPage,
      pageIndex: this.paginator.page
    });

    const type =
      selectedFlight.currentFlight.type === FlightOrGateEventType.Flight
        ? FlightOrGateEventType.Flight
        : FlightOrGateEventType.Gate;

    this.flightsService.getPassengers(
      from,
      to,
      selectedFlight.currentFlight.flight,
      selectedFlight.currentFlight.airport,
      selectedFlight.currentFlight.direction,
      type,
      this.paginator.perPage,
      this.paginator.page
    );

    this.flightsService.getFlights(
      from,
      to,
      this.paginator.perPage,
      this.paginator.page,
      type,
      selectedFlight.currentFlight.flight
    );

    this.flightsService.getCounters(from, to);
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
  }

  public onSelectHour({ target: { value } }, type: 'startHour' | 'endHour') {
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
  }

  public onChangePage(paginator: Paginator) {
    this.subscriptions.push(
      this.flightsService.selectedFlight$.subscribe(selectedFlight => {
        const type =
          selectedFlight.currentFlight.type === FlightOrGateEventType.Flight
            ? FlightOrGateEventType.Flight
            : FlightOrGateEventType.Gate;
        this.flightsService.getPassengers(
          selectedFlight.from,
          selectedFlight.to,
          selectedFlight.currentFlight.flight,
          selectedFlight.currentFlight.airport,
          selectedFlight.currentFlight.direction,
          type,
          paginator.perPage,
          paginator.page - 1
        );
      })
    );
  }

  public onExportExcelButtonClick(buttonElementRef) {
    const { selectedFlight } = this.flightsService.getStore();

    if (selectedFlight) {
      const type =
        selectedFlight.currentFlight.type === FlightOrGateEventType.Flight
          ? FlightOrGateEventType.Flight
          : FlightOrGateEventType.Gate;

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
            type,
            flight: selectedFlight.currentFlight.flight,
            airport: selectedFlight.currentFlight.airport,
            direction: selectedFlight.currentFlight.direction,
            from: formatDateAsUTC(this.startDate, this.ngForm.value.startHour),
            to: formatDateAsUTC(this.endDate, this.ngForm.value.endHour)
          },
          exportCallback: this.flightsService.exportPassengers.bind(
            this.flightsService
          ),
          modalType: ExportationTypes.DisplacementPage
        }
      );
    }
  }

  private applyFilter(filterValue: string) {
    if (this.dataSource) {
      if (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.dataSource.filter = '';
      }
    }
  }

  private onSearchbarTextChangeHandler() {
    this.subscriptions.push(
      this.headerService.searchbar$.subscribe(({ text }) => {
        this.applyFilter(text);
      })
    );
  }

  private onFlightsAndGatesThingsHandler() {
    this.subscriptions.push(
      this.flightsService.passengers$
        .pipe(filter(x => !!x))
        .subscribe((passangers: PaginatedList<FlightsPassengers>) => {
          this.peopleList = passangers.items;
          this.dataSource = new MatTableDataSource(passangers.items);
          this.dataSource.sort = this.sort;

          if (passangers.items.length === 0) {
            this.emptyTable();
          }

          this.isFetching = false;
          this.flightsService.updateIsFetchingPassengersState(false);
        })
    );
  }

  private emptyTable() {
    this.dataSource = null;
    const emptyArray = Array(10);

    this.dataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        thingId: '',
        deviceId: '',
        thingName: '',
        thingType: '',
        thingEmployer: '',
        thingPhone: '',
        thingEmail: '',
        thingDepartment: '',
        thingPosition: '',
        thingCompanyName: '',
        thingSourceInfoType: '',
        thingSourceInfoValue: '',
        deviceSourceIdentificator: '',
        latestReportTime: '',
        role: '',
        roleType: '',
        department: '',
        phone: '',
        email: ''
      }))
    );
  }

  private setupDatesInitialValues(): void {
    this.selectedFlight$.subscribe(selectedFlight => {
      if (selectedFlight) {
        const { from, to } = selectedFlight;

        const fromDate = new Date(from);
        const toDate = new Date(to);

        this.startDate = `${fromDate.getUTCFullYear()}-${
          fromDate.getUTCMonth() + 1
        }-${fromDate.getUTCDate()}`;
        this.endDate = `${toDate.getUTCFullYear()}-${
          toDate.getUTCMonth() + 1
        }-${toDate.getUTCDate()}`;

        this.ngForm.controls.startHour.setValue(
          `${getHoursString(fromDate)}:${getMinutesString(fromDate)}`
        );

        this.ngForm.controls.endHour.setValue(
          `${getHoursString(toDate)}:${getMinutesString(toDate)}`
        );
      }
    });
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/flights-and-gates',
      text: 'BREADCRUMB.FLIGHTS_AND_GATES'
    });

    this.subscriptions.push(
      this.flightsService.selectedFlight$.subscribe(selectedTrip => {
        if (selectedTrip) {
          if (this.breadcrumbService.getBreadcrumb().stack.length > 2) {
            this.breadcrumbService.popBreadcrumbItem();
          }

          if (selectedTrip.currentFlight.type === FlightOrGateEventType.Gate) {
            this.breadcrumbService.pushBreadcrumbItem({
              route: '/flights-and-gates/people',
              text: `${selectedTrip.currentFlight.type}-${selectedTrip.currentFlight.direction}`.toUpperCase()
            });
          } else if (
            selectedTrip.currentFlight.type === FlightOrGateEventType.Flight
          ) {
            this.breadcrumbService.pushBreadcrumbItem({
              route: '/flights-and-gates/people',
              text: `${selectedTrip.currentFlight.type}_#${selectedTrip.currentFlight.flight}`.toUpperCase()
            });
          }
        }
      })
    );
  }

  private setupSearchbar(): void {
    this.headerService.updateSearchbar({
      isVisible: true,
      placeholder: 'DISPLACEMENT.BADGE_IAM_ID_LINE'
    });
  }

  private tearDownBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(false);
    this.breadcrumbService.popBreadcrumbItem();
    this.breadcrumbService.popBreadcrumbItem();
  }

  private tearDownSearchbar(): void {
    this.headerService.updateSearchbarVisibilityTo(false);
  }
}
