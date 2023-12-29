/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ExcelService } from '../../core/services/excel-service/excel.service';
import { PaginatedModel } from '../../shared/models/paginatedModel';
import { Site } from '../../shared/models/site';
import { Thing } from '../../shared/models/thing';
import { BreadcrumbService } from '../../stores/breadcrumb/breadcrumb.service';
import { HeaderService } from '../../stores/header/header.service';
import { SitesService } from '../../stores/sites/sites.service';
import { ThingsService } from '../../stores/things/things.service';
import { PeopleService } from '../../core/services/people-service/people-service';
import { PeopleLogStatus } from '../../shared/enums/peopleLogStatus';
import { TWELVE_HOURS_IN_MINUTES } from '../../shared/constants';
import { RealTimeSelectorService } from '../../stores/real-time-events-selector/real-time-events-selector.service';
import { FeatureFlagsStateService } from '../../stores/feature-flags/feature-flags-state.service';
import { FeatureFlags } from '../../core/constants/feature-flags.const';
import { EventDirectionsLabels } from '../../core/constants/event-directions';
import { Middlewares } from '../../core/constants/middleware.const';
import {
  getSecurityCenterTypeAccess,
  getTypeAccess,
  isBusIntegrationEvent,
  isExitingEvent
} from '../../shared/utils/location-events-helpers/location-events-helpers';
import { EventTypeLabels } from '../../core/constants/event-type';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';
import { ValeLocations } from '../../shared/models/valeLocations';
import { GetGeofenceNames } from '../../shared/utils/valeLocation-helper';

type ExcelParams = {
  Site: string;
  Nome: string;
  MatriculaDoc: string;
  UltimoRegistro: string;
  UltimaLocalizacao: string;
  TipoDeLocalizacao: string;
  Numero: string;
  Leitor_Camera: string;
  Cercas: string;
  Empresa: string;
  Placa: string;
  TipoAcesso: string;
};

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListPage implements OnInit {
  @ViewChild(MatSort, { static: true }) public matSortRef: MatSort;

  public tableColumns: string[] = [
    'name',
    'documentId',
    'lastReport',
    'lastLocation',
    'middleware',
    'device',
    'cameraName',
    'fence',
    'companyName'
  ];

  public tableDataSource: MatTableDataSource<Thing>;

  public selectedSite: Site;

  public skeletonArray = Array(15);

  public thingsAsPaginatedList$: Observable<PaginatedModel<Thing[]>>;

  public isFetchingThings$: Observable<boolean>;

  public thingsCount$: Observable<number>;

  private thingsRefreshTimeout: NodeJS.Timer;

  private subscriptions: Subscription[] = [];

  public refreshTimeInfo$: Observable<Date>;

  public canViewSensitiveData: boolean;

  public isControlCenterProfile: boolean;

  public showDeviceGroupDisclaimer = false;

  public EventTypeLabels = EventTypeLabels;

  constructor(
    private realTimeSelectorService: RealTimeSelectorService,
    private thingsService: ThingsService,
    private excelService: ExcelService,
    private sitesService: SitesService,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private userProfileService: UserProfileService,
    private peopleService: PeopleService,
    private featureFlagsStateService: FeatureFlagsStateService
  ) {}

  public ngOnInit(): void {
    this.thingsAsPaginatedList$ = this.thingsService.thingsAsPaginatedList$;
    this.thingsCount$ = this.thingsService.thingsCount$;
    this.refreshTimeInfo$ = this.setupRefreshTimerInfoObs();
    this.isFetchingThings$ = this.thingsService.isFetchingThings$;

    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();
    this.isControlCenterProfile =
      this.userProfileService.isControlCenterProfile();

    if (!this.canViewSensitiveData) {
      this.tableColumns = this.tableColumns.filter(
        tableColumn => tableColumn !== 'documentId'
      );
    }

    const featureflagsSubscription$ =
      this.featureFlagsStateService.activeFeatureFlags$.subscribe(
        featureFlags => {
          this.showDeviceGroupDisclaimer = featureFlags.some(
            featureFlag =>
              featureFlag.name === FeatureFlags.DeviceGroupDisclaimer
          );
        }
      );
    this.subscriptions.push(featureflagsSubscription$);

    this.setupSearchbar();
    this.setupBreadcrumb();

    this.onSearchbarTextChangeHandler();
    this.onSelectedSiteChangeHandler();
    this.onThingsAsPaginatedListChangeHandler();
  }

  public ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    this.headerService.clearHeaderStore();

    this.tearDownSearchbar();
    this.tearDownBreadcrumb();

    clearTimeout(this.thingsRefreshTimeout);
  }

  public exportExcel(): void {
    const { name: siteName } = this.sitesService.getSelectedSite();
    const things = this.thingsService.getThings();
    const userEmail = this.userProfileService.getUserProfile().email;
    const arrayExcel = things.map<ExcelParams>(thing => {
      return this.mapThingToExcelParams(thing, siteName);
    });

    this.excelService.exportAsExcelFile(arrayExcel, 'GapList');
    this.peopleService.createPeopleLog(
      siteName,
      userEmail,
      PeopleLogStatus.Success
    );
  }

  public onChangePage({ page: newPage }: { page: number }): void {
    this.thingsService.changeThingsAsPaginatedListPage(newPage);
  }

  public onSelectSite(): void {
    this.thingsService.clearThings();
  }

  private isBus(middleware: string): boolean {
    return middleware === Middlewares.Bus;
  }

  private isFacialRecognition(middleware: string): boolean {
    return middleware === Middlewares.FacialRecognitionAdapter;
  }

  private mapThingToExcelParams(thing: Thing, siteName: string): ExcelParams {
    const {
      name: Nome,
      eventDateTime,
      latitude,
      longitude,
      middleware: TipoDeLocalizacao,
      companyName: Empresa
    } = thing;

    let eventType = '-';

    if (thing.middleware === Middlewares.Bus) {
      if (isBusIntegrationEvent(thing.eventType)) {
        eventType = isExitingEvent(thing.eventDirection)
          ? EventDirectionsLabels.Exit
          : EventDirectionsLabels.Entrance;
      } else {
        eventType = EventDirectionsLabels.Internal;
      }
    }

    if (thing.middleware === Middlewares.SecurityCenter) {
      eventType = getSecurityCenterTypeAccess(thing);
    }
    return {
      Site: siteName,
      Nome,
      MatriculaDoc: this.isControlCenterProfile ? '-' : thing.document,
      UltimoRegistro: moment(eventDateTime).format('DD/MM/YYYY-HH:mm'),
      UltimaLocalizacao: `${latitude}, ${longitude}`,
      TipoDeLocalizacao,
      Placa: thing.licensePlate == null ? '-' : thing.licensePlate,
      Numero: this.isFacialRecognition(thing.middleware) ? '-' : thing.deviceId,
      Leitor_Camera: thing.cameraName === '' ? '-' : thing.cameraName,
      Cercas: thing.fences,
      Empresa,
      TipoAcesso: eventType
    };
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.updateBreadcrumbVisibilityTo(true);
    this.breadcrumbService.pushBreadcrumbItem({
      route: '/list',
      text: 'BREADCRUMB.LIST'
    });
  }

  private setupSearchbar(): void {
    this.headerService.updateSearchbar({
      isVisible: true,
      placeholder: 'MESSAGES.FILTER_BY_NAME_DOC_DEVICE'
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
      ({ text: searchbarText }) => {
        if (this.tableDataSource) {
          this.thingsService.filterThings(searchbarText);
        }
      }
    );

    this.subscriptions.push(searchbarText$);
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (selectedSite) {
          this.realTimeSelectorService.isRealTimeSearch$
            .pipe(
              filter(isRealTimeSearch => isRealTimeSearch != null),
              take(1)
            )
            .subscribe(isRealTimeSearch => {
              this.thingsService.syncThingsByLastLocation({
                site: selectedSite,
                periodInMinutesToFilter: TWELVE_HOURS_IN_MINUTES,
                isRealTimeSearch
              });
            });
        }
      }
    );

    this.subscriptions.push(selectedSite$);
  }

  private onThingsAsPaginatedListChangeHandler(): void {
    const things$ = this.thingsService.thingsAsPaginatedList$.subscribe(
      thingsAsPaginatedList => {
        if (thingsAsPaginatedList) {
          if (thingsAsPaginatedList.data.length === 0) {
            this.emptyTable();
          } else {
            thingsAsPaginatedList.data.forEach(thing => {
              thing.typeAccess = getTypeAccess(thing);
              this.setDisplayValues(thing);
            });

            this.tableDataSource = new MatTableDataSource(
              thingsAsPaginatedList.data
            );

            this.tableDataSource.filterPredicate = this.tableFilterPredicate;
            this.tableDataSource.sort = this.matSortRef;
          }

          clearTimeout(this.thingsRefreshTimeout);

          const { things } = this.thingsService.getStore();

          const TWO_MINUTES_AND_A_HALF_SECOND = 120_500;

          const periodToFilter = things.length ? null : TWELVE_HOURS_IN_MINUTES;

          this.thingsRefreshTimeout = setTimeout(() => {
            this.realTimeSelectorService.isRealTimeSearch$
              .pipe(
                filter(isRealTimeSearch => isRealTimeSearch != null),
                take(1)
              )
              .subscribe(isRealTimeSearch => {
                this.thingsService.syncThingsByLastLocation({
                  site: this.selectedSite,
                  periodInMinutesToFilter: periodToFilter,
                  isRealTimeSearch
                });
              });
          }, TWO_MINUTES_AND_A_HALF_SECOND);
        }
      }
    );

    this.subscriptions.push(things$);
  }

  private setDisplayValues(thing: Thing) {
    if (this.isBus(thing.middleware)) {
      thing.displayName = `${thing.middleware} - ${thing?.licensePlate}`;
    } else if (this.isFacialRecognition(thing.middleware)) {
      thing.displayName = 'Rec. Facial';
      thing.deviceId = '-';
    } else {
      thing.displayName = thing.middleware;
    }
  }

  private emptyTable() {
    const emptyArray = Array(15);

    this.tableDataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        deviceType: null,
        document: null,
        eventDateTime: null,
        latitude: null,
        name: null,
        licensePlate: null
      }))
    );
  }

  private tableFilterPredicate(data: Thing, predicateFilter: string): boolean {
    const { name, document, deviceType, deviceId } = data;
    return (
      (name && name.trim().toLowerCase().indexOf(predicateFilter) !== -1) ||
      (document &&
        document.trim().toLowerCase().indexOf(predicateFilter) !== -1) ||
      (deviceType &&
        deviceType.trim().toLowerCase().indexOf(predicateFilter) !== -1) ||
      (deviceId &&
        deviceId.trim().toLowerCase().indexOf(predicateFilter) !== -1)
    );
  }

  private setupRefreshTimerInfoObs(): Observable<Date> {
    return this.thingsService.refreshTimeInfo$.pipe(
      filter((refreshDate: Date) => !!refreshDate)
    );
  }

  public showValeLocations(
    valeLocations: ValeLocations[],
    isItForExport: boolean
  ): string {
    return GetGeofenceNames(valeLocations, isItForExport);
  }

  public formatFences(fences: string): string {
    return fences
      ?.split(';')
      .map(fence => `${fence}`)
      .join('\n');
  }
}
