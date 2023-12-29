import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransportsRepository } from '../../core/repositories/transports.repository';
import { Filter } from '../../shared/models/filter';
import { Site } from '../../shared/models/site';
import { Paginator } from '../../components/presentational/paginator/paginator.component';
import { HeaderService } from '../../stores/header/header.service';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';
import { SitesService } from '../../stores/sites/sites.service';
import {
  formatDate,
  formatDateAsUTC,
  getHoursString,
  getMinutesString,
} from '../../shared/utils/date';
import { OverlayService } from '../../core/services/overlay.service';
import { DisplacementExportOverlayComponent } from '../displacement/displacement-export-overlay/displacement-export-overlay.component';
import { SiteRepository } from '../../core/repositories/site.repository';
import { ExcelService } from '../../core/services/excel-service/excel.service';

@Component({
  selector: 'app-displacement-old',
  templateUrl: './displacement-old.page.html',
  styleUrls: ['./displacement-old.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplacementOldPage implements OnInit {
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  @ViewChild('searchDatepicker')
  public childSearchDatepicker;

  public dataSource: MatTableDataSource<any>;

  public displayedColumns: string[] = [
    'company',
    'line',
    'networkKey',
    'nameEmployee',
    'badge',
    'lastLocation',
    'lastReport',
  ];

  public sitesList = [];

  public transportsList = [];

  public transportsBySite: any[] = [];

  public sortedData = [];

  public fields = [];

  public nameForm: string;

  public transportsTotal;

  public currentTimeZone;

  public name = new FormControl('', []);

  public ngForm: FormGroup;

  public searchTerm = '';

  public listLine = [];

  public filter = new Filter();

  public exportOverlayRef;

  public startDate;

  public endDate;

  public maxCalendarDate: Date;

  public currentDate: Date;

  public skeletonArray = Array(10);

  public isFetching = false;

  public isLoadingExport = false;

  public paginator: Paginator = { page: 1, perPage: 10, total: 0 };

  public selectedSite: Site;

  private transportsListTimeout: any;

  private listTransportsBySite$: any;

  private subscriptions: Subscription[] = [];

  sitesList$: Observable<Site[]>;

  selectedState$: Observable<Site>;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private transportRepository: TransportsRepository,
    private fb: FormBuilder,
    private headerService: HeaderService,
    private sitesService: SitesService,
    private siteRepository: SiteRepository,
    private overlayService: OverlayService,
    private excelService: ExcelService,
  ) {
    this.ngForm = this.fb.group({
      cardId: '',
      keyId: '',
      name: '',
      lineName: '',
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
    });

    this.maxCalendarDate = new Date();
    this.currentDate = new Date();
  }

  public ngOnInit(): void {
    this.exportOverlayRef = this.overlayService.create();

    this.emptyTable();

    this.setupSearchbar();
    this.setupBreadcrumb();

    this.onSearchbarTextChangeHandler();
    this.updateTransportListOnStateChange();

    this.siteRepository
      .listSitesByFilter(2)
      .toPromise()
      .then(sites => {
        this.sitesList = sites;
      });
  }

  public ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }

    if (this.listTransportsBySite$) {
      clearTimeout(this.transportsListTimeout);
      this.listTransportsBySite$.unsubscribe();
    }

    this.tearDownSearchbar();
    this.tearDownBreadcrumb();
  }

  public applyFilter(filterValue: string): void {
    if (this.dataSource) {
      if (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.dataSource.filter = '';
      }
    }
  }

  public areFormDatetimesIntervalValid(): boolean {
    return this.startDate && this.endDate && this.ngForm.valid;
  }

  public formatDateAsUTC(date: string | Date): string {
    return formatDateAsUTC(date);
  }

  public onClearSearchButtonClick(): void {
    this.emptyTable();
    this.clearSearchFilter();
  }

  public onSiteSelect(site: Site): void {
    this.sitesService.updateSelectedState(site);
  }

  public onChangePage(paginatorUpdated: Paginator): void {
    this.paginator = paginatorUpdated;

    const from = formatDateAsUTC(this.startDate, this.ngForm.value.startHour);
    const till = formatDateAsUTC(this.endDate, this.ngForm.value.endHour);

    this.updateTransportsList(from, till);
  }

  public onApplyFilterButtonClick(): void {
    const from = formatDateAsUTC(this.startDate, this.ngForm.value.startHour);
    const till = formatDateAsUTC(this.endDate, this.ngForm.value.endHour);

    this.updateTransportsList(from, till);
  }

  public onExportExcelButtonClick(buttonElementRef: ElementRef): void {
    this.overlayService.open<DisplacementExportOverlayComponent>(
      this.exportOverlayRef,
      buttonElementRef,
      DisplacementExportOverlayComponent,
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 30,
      },
      {
        from: formatDateAsUTC(this.startDate, this.ngForm.value.startHour),
        till: formatDateAsUTC(this.endDate, this.ngForm.value.endHour),
        exportCallback: this.excelService.exportDisplacementsAsExcelToLoggedUserEmail.bind(
          this.excelService,
        ),
      },
    );
  }

  public onSelectDate({ value: date }, type: 'startDate' | 'endDate'): void {
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
      formatDateAsUTC(this.endDate, this.ngForm.value.startHour),
    );
    const endDate = new Date(
      formatDateAsUTC(this.endDate, this.ngForm.value.endHour),
    );
    const todayDate = new Date();

    if (startDate > todayDate) {
      this.ngForm.controls.startHour.setValue(
        `${getHoursString(todayDate)}:${getMinutesString(todayDate)}`,
      );
    }

    if (endDate > todayDate) {
      this.ngForm.controls.endHour.setValue(
        `${getHoursString(todayDate)}:${getMinutesString(todayDate)}`,
      );
    }
  }

  public onSelectHour(
    { target: { value } },
    type: 'startHour' | 'endHour',
  ): void {
    const selectedDate = new Date(
      formatDateAsUTC(
        type === 'startHour' ? this.startDate : this.endDate,
        value,
      ),
    );
    const todayDate = new Date();

    if (selectedDate > todayDate) {
      this.ngForm.controls[type].setValue(
        `${getHoursString(todayDate)}:${getMinutesString(todayDate)}`,
      );
    } else {
      this.ngForm.controls[type].setValue(
        `${getHoursString(selectedDate)}:${getMinutesString(selectedDate)}`,
      );
    }
  }

  public updateTransportsList(from?: string, till?: string): void {
    clearTimeout(this.transportsListTimeout);

    if (this.selectedSite) {
      this.isFetching = true;

      this.listTransportsBySite$ = this.transportRepository
        .listTransportsBySite(this.selectedSite, this.paginator, from, till)
        .subscribe(
          response => {
            this.paginator.total = response.headers.get('X-Total-Count');
            this.transportsTotal = response.headers.get('X-Total-Count');
            this.sortedData = response.body;
            this.transportsList = response.body;
            this.dataSource = new MatTableDataSource(this.transportsList);
            this.dataSource.filterPredicate = this.tableFilterSetting();
            this.dataSource.sort = this.sort;

            if (!from && !till) {
              this.updateTransportsListBySiteInAWhile();
            }
            this.isFetching = false;
          },
          () => {
            this.listTransportsBySite$.unsubscribe();
            this.emptyTable();
          },
        );
    }
  }

  public setDate({ value: date }, type): void {
    if (type === 'startDate') {
      this.startDate = formatDate(date);
    }

    if (type === 'endDate') {
      this.endDate = formatDate(date);
      this.maxCalendarDate = date;
    }
  }

  private setupSearchbar(): void {
    this.headerService.updateSearchbar({
      isVisible: false,
      placeholder: 'DISPLACEMENT.BADGE_IAM_ID_LINE',
    });
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/displacement',
      text: 'BREADCRUMB.UNIFIED_LIST',
    });
  }

  private tearDownSearchbar(): void {
    this.headerService.updateSearchbarVisibilityTo(false);
  }

  private tearDownBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(false);
    this.breadcrumbService.popBreadcrumbItem();
  }

  private onSearchbarTextChangeHandler(): void {
    const searchbarText$ = this.headerService.searchbar$.subscribe(
      ({ text }) => {
        this.applyFilter(text);
      },
    );

    this.subscriptions.push(searchbarText$);
  }

  private clearSearchFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.ngForm.reset();

    if (this.childSearchDatepicker) {
      this.childSearchDatepicker.reset();
    }
  }

  private emptyTable(): void {
    this.transportsList = [];
    this.dataSource = null;
    this.sortedData = [];
    this.transportsTotal = 0;
    this.paginator.total = 0;
    this.isFetching = false;
    this.maxCalendarDate = new Date();

    const emptyArray = Array(10);

    this.dataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        deviceType: '-',
        document: '-',
        eventDateTime: '-',
        id: '-',
        latitude: '-',
        name: '-',
        nameEmployee: '-',
        networkKey: '-',
      })),
    );
  }

  private updateTransportsListBySiteInAWhile() {
    this.transportsListTimeout = setTimeout(() => {
      this.updateTransportsList();
    }, 300000);
  }

  // private exportExcel(buttonElementRef) {

  // const arrayExcel: any[] = [];
  // this.dataSource.filteredData.forEach((transport) => {
  //   const date = new Date(transport.eventDateTime);
  //   const auxDate = date.toLocaleDateString();
  //   const auxTime = date.toLocaleTimeString();
  //   arrayExcel.push({
  //     Nome: transport.name,
  //     Documento: transport.document,
  //     UltimaLocalizacao: auxDate + "-" + auxTime,
  //     Device: transport.deviceType,
  //   });
  // });
  // this.excelService.exportAsExcelFile(arrayExcel, "GapList");
  // }

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

  private updateTransportListOnStateChange() {
    const selectedState = this.sitesService.selectedState$.subscribe(
      (site: Site) => {
        this.selectedSite = site;

        const from = formatDateAsUTC(
          this.startDate,
          this.ngForm.value.startHour,
        );
        const till = formatDateAsUTC(this.endDate, this.ngForm.value.endHour);

        if (from && till) this.updateTransportsList(from, till);
      },
    );

    this.subscriptions.push(selectedState);
  }
}
