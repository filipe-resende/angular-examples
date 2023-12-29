import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  skip,
  startWith,
  take,
  tap
} from 'rxjs/operators';
import { NotificationService } from '../../components/presentational/notification';
import { OverlayExporterComponent } from '../../components/presentational/overlay-exporter/overlay-exporter.component';
import { MapTwoComponent } from '../../components/smart/map-two/map-two.component';
import { ApplicationsIds } from '../../core/constants/applications-ids';
import { SaloboDeviceGroups } from '../../core/constants/salobo-device-groups.enum';
import { LocationRepositoryDocumentType } from '../../core/repositories/location-events.repository';
import { ApplicationService } from '../../core/services/application-service/application.service';
import { OverlayService } from '../../core/services/overlay.service';
import { ExportationTypes } from '../../shared/enums/ExportationTypes';
import Application from '../../shared/models/application';
import { DeviceLocation } from '../../shared/models/device';
import { Geofence } from '../../shared/models/geofence';
import GeofenceCategory from '../../shared/models/geofence-category';
import { Perimeter } from '../../shared/models/perimeter';
import { Site } from '../../shared/models/site';
import { ExtendedThing, Thing } from '../../shared/models/thing';
import { ThingByName } from '../../shared/models/thingByName';
import { cloneObject } from '../../shared/utils/clone';
import { DevicesService } from '../../stores/devices/devices.service';
import { GeofencesService } from '../../stores/geofences/geofences.service';
import { HeaderService } from '../../stores/header/header.service';
import { PerimetersService } from '../../stores/perimeters/perimeters.service';
import { PoisService } from '../../stores/pois/pois.service';
import { SitesService } from '../../stores/sites/sites.service';
import { ThingsService } from '../../stores/things/things.service';
import { ThingTrackModel } from '../../stores/things/things.state';
import { FeatureFlagsStateService } from '../../stores/feature-flags/feature-flags-state.service';
import { FeatureFlags } from '../../core/constants/feature-flags.const';
import { getTypeAccess } from '../../shared/utils/location-events-helpers/location-events-helpers';
import { HistoricListComponent } from './historic-list/historic-list.component';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';

export enum HistoricTabs {
  tabRealTime = 'tabRealTime',
  tab30min = 'tab30min',
  tab2h = 'tab2h',
  tab2hPlus = 'tab2hPlus'
}

export enum DocTypes {
  CPF = 'HISTORIC.CPF',
  Name = 'HISTORIC.NAME',
  Registration = 'HISTORIC.REGISTRATION'
}
export interface SelectableThingTrackModel extends ThingTrackModel {
  isThingSelected?: boolean;
  id?: string;
}

const PERIOD_IN_MINUTES_TO_FILTER_2H = 2 * 60;
const PERIOD_IN_MINUTES_TO_FILTER_REAL_TIME = 12 * 60;
const PERIOD_IN_MINUTES_TO_FILTER_30MIN = 30;

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoricPage implements OnInit, OnDestroy {
  // #region [Declarations]

  @ViewChild('thingInput')
  public thingInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto') public matAutocomplete: MatAutocomplete;

  @ViewChild(MapTwoComponent) public googleMapRef: MapTwoComponent;

  @ViewChild(HistoricListComponent)
  public historicComponentRef: HistoricListComponent;

  @ViewChild('geofencesSelector')
  public geofencesSelectorRef;

  @ViewChild('devicesSelector')
  public devicesSelectorRef;

  @ViewChild('datepicker2hPlus')
  public childDatepicker2hPlus;

  public currentDate: Date;

  public deviceDontReportingTimePeriod = '10';

  public docTypes = [DocTypes.Name, DocTypes.CPF, DocTypes.Registration];

  public docTypeName = DocTypes.Name;

  public endDate;

  public filteredSingleThing: SelectableThingTrackModel;

  public geofences: Geofence[] = [];

  private periodInMinutes: number = PERIOD_IN_MINUTES_TO_FILTER_30MIN;

  private isRealTimeSearch: boolean;

  public geofenceListOptions: Array<{
    label: string;
    value: any;
    colorBox?: string;
    imgOrColorBoxWidth?: number;
    imgOrColorBoxHeight?: number;
  }> = [];

  public maxCalendarDate: Date;

  public ngForm: FormGroup;

  public poiList = [];

  public registrationDocumentPersonInputValue = '';

  public selectedDocType: any;

  public selectedApplication: Application[];

  public selectedApplicationFilter: string;

  public startDate;

  public showAllGeofencesToggle = true;

  public showAllPoisToggle: boolean;

  public selectedSite: Site;

  public selectedThing: Thing;

  public selectedGeofence: Geofence;

  public selectedCustomGeofenceObj: any;

  public tabSelected = 0;

  public exportOverlayRef;

  public thingCtrl = new FormControl();

  public things: ExtendedThing[] = [];

  public thingsOnlyNames: Thing[] = [];

  public thingsSelectOptions: Observable<any[]>;

  public refreshTimeInfo$: Observable<Date>;

  public is2hPlusDateValid = true;

  public is2hPlusInputValid = true;

  public isAutoSyncThingsUpdateEnabled = false;

  public isAutoSyncThingsUpdate = false;

  public isFetching = false;

  public isFetchingApplications = false;

  public isApplyingFilters = false;

  public isFetchingGeofences = false;

  public isFetchingPois = false;

  public isLeftMenuOpened = true;

  public willApplyDeviceDontReportingTimeRule = false;

  public searchbarText = '';

  public thingsPreviewList$: Observable<ThingByName[]>;

  public thingSelectedByPreviewList: ThingByName;

  private subscriptions: Subscription[] = [];

  private thingsRefreshTimeout: any;

  private SEE_TRACK_TEXT = '';

  private TRACKING_NOT_FOUND_TEXT = '';

  private NOT_FOUND = '';

  private geofencesCategories: GeofenceCategory[] = [];

  public geofences$: Observable<Geofence[]>;

  public applications$: Observable<Application[]>;

  public isActiveDeviceGroupFiltering: boolean;

  public loadingApplications = true;

  private geofencesToFilter: Geofence[] = [];

  public canViewSensitiveData: boolean;

  public showDeviceGroupDisclaimer = false;

  public shouldDistinguishSpots = false;

  public selectedDeviceLocation: DeviceLocation;

  public spotsCounter = {
    fixed: 0,
    slbIII: 0,
    floating: 0
  };

  public dateFrom: string = null;

  public dateTill: string = null;

  // #endregion

  constructor(
    private sitesService: SitesService,
    private geofencesService: GeofencesService,
    private poisService: PoisService,
    private thingsService: ThingsService,
    private headerService: HeaderService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private perimetersService: PerimetersService,
    private userProfileService: UserProfileService,
    private overlayService: OverlayService,
    private deviceService: DevicesService,
    private aplicationService: ApplicationService,
    private featureFlagsStateService: FeatureFlagsStateService
  ) {
    this.updateThingsSelectOptions();
    this.ngForm = this.formBuilder.group({
      employeeName: '',
      startHour: '',
      endHour: ''
    });

    this.maxCalendarDate = new Date();
    this.currentDate = new Date();
  }

  public ngOnInit(): void {
    this.setupTranslatedTexts();
    this.onThingsChangeHandler();
    this.onSelectedThingTrackingChangeHandler();
    this.onPoisChangeHandler();
    this.onSearchbarTextChangeHandler();
    this.updateEmployeeNameSub();

    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();

    this.geofencesService.updateGeofencesCategories();

    this.thingsPreviewList$ = this.thingsService.thingsFilteredByNameList$;
    this.geofences$ = this.geofencesService.geofences$;
    this.refreshTimeInfo$ = this.setupRefreshTimerInfoObs();
    this.exportOverlayRef = this.overlayService.create();

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
  }

  getSpotGroupName(deviceGroupName: string): string {
    if (deviceGroupName === SaloboDeviceGroups.Fixed) return 'SLB I+II';
    if (deviceGroupName === SaloboDeviceGroups.SLBIII) return 'SLB III';
    return 'Temporário';
  }

  getMiddlewareName(thing: ExtendedThing): string {
    if (
      thing.applicationId.toLowerCase() === ApplicationsIds.SPOT &&
      this.shouldDistinguishSpots
    ) {
      return `${thing?.middleware} ${this.getSpotGroupName(
        thing.deviceCategoryName
      )}`;
    }
    return thing?.middleware;
  }

  private setupRefreshTimerInfoObs(): Observable<Date> {
    return this.thingsService.refreshTimeInfoHistoricPage$.pipe(
      filter((refreshDate: Date) => !!refreshDate)
    );
  }

  public ngAfterViewInit(): void {
    if (this.googleMapRef) {
      this.googleMapRef.setMap();
    }

    this.applications$ = this.aplicationService.getApplicationForSearchScreen();
    this.applications$.subscribe(() => {
      this.loadingApplications = false;
    });

    this.onSelectedSiteChangeHandler();
    this.onPerimetersChangeHandler();
    this.onGeofencesChangeHandler();
    this.onGeofencesCategoriesChangeHandler();

    this.changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());

    this.geofencesService.clearGeofencesStore();
    this.poisService.clearPoisStore();
    this.thingsService.updateThingsState({
      thingsToDisplayAtMap: [],
      thingTracking: null
    });

    this.disableAutoSyncThingsByLastLocation();
  }

  public clearGeofences() {
    this.googleMapRef.clearGeofences();
  }

  public clearMapFilteredOverlays(): void {
    this.clearThingsOnMap();
  }

  public onOpenLeftMenuButtonClick(): void {
    this.isLeftMenuOpened = true;
  }

  public onCloseLeftMenuButtonClick(): void {
    this.isLeftMenuOpened = false;
  }

  public onThingSelect(thing: ThingByName): void {
    this.thingSelectedByPreviewList = thing;
  }

  public onApplicationSelect(application: Application[]): void {
    this.selectedApplicationFilter = application.map(({ id }) => id).join(',');
  }

  public onGeofencesChange(geofences: Geofence[]): void {
    this.geofencesToFilter = geofences;
  }

  public onApplyFiltersClick(searchType: HistoricTabs): void {
    const { latitude, longitude, zoom } = this.selectedSite;
    this.googleMapRef.setMapOn(latitude, longitude, zoom);
    this.clearSelectedThing();
    this.googleMapRef.markedGeofences = [];
    this.googleMapRef.geofenceDetailsFromMarkedGeofences = [];

    if (this.geofencesToFilter.length === 0) {
      this.googleMapRef.showAllGeofencesToggle = true;
      this.googleMapRef.setGeofencesVisibilityTo(true);
    } else {
      this.googleMapRef.setFilteredGeofencesToPolygon(this.geofencesToFilter);
    }

    this.thingsService.updateThingsState({
      thingsToDisplayAtMap: [],
      thingTracking: null,
      latestEventDate: null
    });
    this.checkIfSpotsCounterShouldBeShown(searchType);

    this.isRealTimeSearch = searchType === HistoricTabs.tabRealTime;

    if (searchType === HistoricTabs.tabRealTime) {
      this.periodInMinutes = PERIOD_IN_MINUTES_TO_FILTER_REAL_TIME;
      this.onApplySelectedTimeFormFilters();
    } else if (searchType === HistoricTabs.tab30min) {
      this.periodInMinutes = PERIOD_IN_MINUTES_TO_FILTER_30MIN;
      this.onApplySelectedTimeFormFilters();
    } else if (searchType === HistoricTabs.tab2h) {
      this.periodInMinutes = PERIOD_IN_MINUTES_TO_FILTER_2H;
      this.onApplySelectedTimeFormFilters();
    } else if (searchType === HistoricTabs.tab2hPlus) {
      this.periodInMinutes = null;
      this.onApply2hPlusFormFilters();
    }
  }

  public onTabClick(tab): void {
    if (tab.index === 0) {
      this.googleMapRef.clearTraceMarker();
      const { latitude, longitude, zoom } = this.selectedSite;
      this.googleMapRef.setMapOn(latitude, longitude, zoom);
      this.tabSelected = tab.index;
    }

    if (tab.index === 1) {
      this.tabSelected = tab.index;
    }
  }

  public onClearFiltersClick(): void {
    this.clearMapFilteredOverlays();
    this.thingsService.updateThingsTracking(null);
    this.setFilteredSingleThing(null);
    this.selectedApplication = [];
    this.clearSelectedThing();
    this.things = [];
    this.tabSelected = 0;
    this.isFetching = false;
    this.thingCtrl = new FormControl();
    this.endDate = '';
    this.startDate = '';
    this.selectedCustomGeofenceObj = null;
    this.registrationDocumentPersonInputValue = '';
    this.ngForm.reset();
    this.headerService.updateSearchbar({ text: '' });
    this.thingSelectedByPreviewList = null;
    this.selectedDocType = null;

    const { latitude, longitude, zoom } = this.selectedSite;

    this.googleMapRef.setMapOn(latitude, longitude, zoom);

    this.geofencesSelectorRef?.clear();
    this.devicesSelectorRef?.clear();

    if (this.childDatepicker2hPlus) {
      this.childDatepicker2hPlus.reset();
    }
  }

  public onDrawThingTraceButtonFromMapInfoWindowClick(
    selectedThing: Thing
  ): void {
    this.selectedThing = selectedThing;
    this.thingsService
      .syncThingTracking(
        selectedThing.id,
        null,
        null,
        null,
        this.periodInMinutes
      )
      .catch(err => this.showTrackingNotFoundError(err))
      .finally(() => {
        if (document.getElementById('infoWindowButton')) {
          document.getElementById('infoWindowButton').innerText =
            this.SEE_TRACK_TEXT;
        }
      });
  }

  public onSelectHour(
    { target: { value } }: { target: { value: any } },
    type: 'startHour' | 'endHour'
  ): void {
    this.ngForm.controls[type].setValue(value);
  }

  public setDate(event, type): void {
    if (type === 'startDate') {
      this.startDate = moment(new Date(event.value)).format('YYYY-MM-DD');
    }

    if (type === 'endDate') {
      this.endDate = moment(new Date(event.value)).format('YYYY-MM-DD');
      this.maxCalendarDate = event.value;
    }
  }

  public setFilteredSingleThing(
    filteredSingleThing: SelectableThingTrackModel
  ): void {
    this.filteredSingleThing = cloneObject(filteredSingleThing);

    if (this.filteredSingleThing !== null) {
      this.filteredSingleThing.typeAccess = getTypeAccess(
        this.filteredSingleThing.lastDeviceLocation
      );
    }
  }

  public showTrackingNotFoundError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.notification.warning(this.TRACKING_NOT_FOUND_TEXT, true, 5000);
    }
  }

  public toggleAllGeofences(toggleEvent): void {
    this.showAllGeofencesToggle = toggleEvent.source
      ? toggleEvent.checked
      : toggleEvent;

    this.setGeofencesVisibilityTo(this.showAllGeofencesToggle);
  }

  public toggleAllPois(toggleEvent): void {
    if (toggleEvent.source) {
      this.showAllPoisToggle = toggleEvent.checked;
    } else {
      this.showAllPoisToggle = toggleEvent;
    }
  }

  public toggleApplyDeviceDontReportingTimeRule({ source: { checked } }): void {
    this.willApplyDeviceDontReportingTimeRule = checked;
  }

  private onPerimetersChangeHandler() {
    const perimeters$ = this.perimetersService.perimeters$
      .pipe(filter(perimeters => perimeters.length > 0))
      .subscribe(perimeters => {
        this.setPerimeterOnMap(perimeters);
      });

    this.subscriptions = [...this.subscriptions, perimeters$];
  }

  private disableAutoSyncThingsByLastLocation() {
    this.isAutoSyncThingsUpdateEnabled = false;
    clearTimeout(this.thingsRefreshTimeout);
  }

  private enableAutoSyncThingsByLastLocation() {
    this.disableAutoSyncThingsByLastLocation();
    this.isAutoSyncThingsUpdateEnabled = true;
    this.thingsRefreshTimeout = setTimeout(() => {
      this.thingsService
        .syncThingsLatestEventsToDisplayOnMapByGeofences(
          this.selectedSite.name,
          this.geofencesToFilter,
          this.periodInMinutes,
          this.selectedApplicationFilter
        )
        .then(() => {
          this.onApplySelectedTimeFormFilters();
          this.enableAutoSyncThingsByLastLocation();
        });
    }, 120_500);
  }

  public alterAutoSync({ source: { checked } }): void {
    this.isAutoSyncThingsUpdate = checked;
  }

  private setupTranslatedTexts(): void {
    this.translate
      .get(['HISTORIC', 'MAP'])
      .toPromise()
      .then(
        ({
          HISTORIC: { TRACKING_NOT_FOUND, NOT_FOUND },
          MAP: { SEE_TRACK }
        }) => {
          this.TRACKING_NOT_FOUND_TEXT = TRACKING_NOT_FOUND;
          this.SEE_TRACK_TEXT = SEE_TRACK;
          this.NOT_FOUND = NOT_FOUND;
        }
      );
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (selectedSite) {
          this.setSiteOnMap(selectedSite);

          this.syncGeofencesBySite(selectedSite);
          this.syncPoisBySite(selectedSite);
        }

        this.geofencesSelectorRef.clear();
        this.devicesSelectorRef.clear();
      }
    );

    this.subscriptions.push(selectedSite$);
  }

  private checkIfSpotsCounterShouldBeShown(searchType: HistoricTabs): void {
    this.shouldDistinguishSpots =
      this.selectedSite.code.valueOf().toString() === '0212' &&
      (searchType === HistoricTabs.tabRealTime ||
        searchType === HistoricTabs.tab2h ||
        searchType === HistoricTabs.tab30min ||
        searchType === HistoricTabs.tab2hPlus);
  }

  private onThingsChangeHandler(): void {
    this.subscriptions.push(
      this.thingsService.things$.subscribe(things => {
        if (things.length > 0) {
          this.thingsOnlyNames = things;
        }
      })
    );

    this.subscriptions.push(
      this.thingsService.thingsToDisplayAtMap$
        .pipe(
          skip(1),
          filter(() => this.isApplyingFilters),
          tap(things => {
            if (!things.length) this.notification.warning(this.NOT_FOUND);
          })
        )
        .subscribe(things => {
          if (things.length > 0) {
            this.thingsOnlyNames = things;

            this.headerService.updateSearchbarVisibilityTo(true);
            this.tabSelected = 1;
          }

          this.things =
            this.thingsService.enrichEventsMiddlewareNameAndTypeAccess(
              things,
              this.shouldDistinguishSpots
            );

          if (this.shouldDistinguishSpots) {
            this.setSpotsTypesCounter();
          }

          this.setFilteredSingleThing(null);

          this.setThingsOnMap(things);
        })
    );
  }

  private setSpotsTypesCounter() {
    this.spotsCounter.fixed = this.things.filter(
      thing =>
        thing.applicationId.toLowerCase() === ApplicationsIds.SPOT &&
        thing.deviceCategoryName === SaloboDeviceGroups.Fixed
    ).length;
    this.spotsCounter.slbIII = this.things.filter(
      thing =>
        thing.applicationId.toLowerCase() === ApplicationsIds.SPOT &&
        thing.deviceCategoryName === SaloboDeviceGroups.SLBIII
    ).length;
    this.spotsCounter.floating = this.things.filter(
      thing =>
        thing.applicationId.toLowerCase() === ApplicationsIds.SPOT &&
        !thing.deviceCategoryName
    ).length;
  }

  private onSelectedThingTrackingChangeHandler(): void {
    const selectedThingTrackingChange$ =
      this.thingsService.thingTracking$.subscribe(thingTracking => {
        if (thingTracking) {
          this.clearMapFilteredOverlays();

          const { devicesLocation } = thingTracking;
          let enrichEventsMiddlewareName = [];

          if (devicesLocation.length) {
            enrichEventsMiddlewareName =
              this.deviceService.enrichDeviceEventsMiddlewareName(
                devicesLocation,
                this.shouldDistinguishSpots
              );

            this.setDeviceTraceOnMap(enrichEventsMiddlewareName);
          }
          // eslint-disable-next-line no-param-reassign
          thingTracking.devicesLocation = enrichEventsMiddlewareName;
          this.setFilteredSingleThing(thingTracking);
          this.tabSelected = 1;
        }
      });

    this.subscriptions.push(selectedThingTrackingChange$);
  }

  private onGeofencesChangeHandler(): void {
    const geofences$ = this.geofencesService.geofences$.subscribe(geofences => {
      this.geofences = geofences;

      this.geofenceListOptions = geofences.map(geofence => ({
        label: geofence.name,
        value: geofence.id,
        colorBox: geofence.color,
        imgOrColorBoxHeight: 12,
        imgOrColorBoxWidth: 12
      }));
      this.setGeofencesOnMap(geofences, this.geofencesCategories);
    });

    this.subscriptions.push(geofences$);
  }

  private onGeofencesCategoriesChangeHandler(): void {
    const geofencesCategories$ =
      this.geofencesService.geofencesCategories$.subscribe(
        geofencesCategories => {
          this.geofencesCategories = geofencesCategories;

          this.setGeofencesOnMap(this.geofences, geofencesCategories);
        }
      );

    this.subscriptions.push(geofencesCategories$);
  }

  private onPoisChangeHandler(): void {
    const pois$ = this.poisService.pois$.subscribe(pois => {
      this.poiList = pois;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.toggleAllPois(!!(window as any).google);

      if (pois.length === 0) {
        this.showAllPoisToggle = false;
      }
    });

    this.subscriptions.push(pois$);
  }

  private onSearchbarTextChangeHandler(): void {
    this.subscriptions.push(
      this.headerService.searchbar$.subscribe(({ text }) => {
        this.searchbarText = text;
      })
    );
  }

  private onApplySelectedTimeFormFiltersFunc(): void {
    this.isApplyingFilters = true;
    this.clearMapFilteredOverlays();

    if (this.selectedThing) {
      this.clearThingsOnMap();
      this.onTrackBySelectedThing();
    } else {
      this.onSyncThingsLatestEventsByGeofences();
    }
  }

  private onApplySelectedTimeFormFilters(): void {
    if (this.isAutoSyncThingsUpdateEnabled) {
      this.disableAutoSyncThingsByLastLocation();
      this.onApplySelectedTimeFormFiltersFunc();
      this.enableAutoSyncThingsByLastLocation();
    } else {
      this.onApplySelectedTimeFormFiltersFunc();
    }
  }

  private onTrackBySelectedThing() {
    const offSetTimeZone = new Date().getTimezoneOffset();
    this.dateFrom = moment(`${this.startDate} ${this.ngForm.value.startHour}`)
      .zone(offSetTimeZone)
      .utc()
      .toISOString();
    this.dateTill = moment(`${this.endDate} ${this.ngForm.value.endHour}`)
      .zone(offSetTimeZone)
      .utc()
      .toISOString();

    this.thingsService
      .syncThingTracking(
        this.selectedThing.id,
        null,
        this.dateFrom,
        this.dateTill,
        this.periodInMinutes
      )
      .catch(err => this.showTrackingNotFoundError(err))
      .finally(() => {
        this.thingsService.updateRefreshTimeInfoHistoricPageState();
        this.isApplyingFilters = false;
      });
  }

  private onSyncThingsLatestEventsByGeofences() {
    this.thingsService
      .syncThingsLatestEventsToDisplayOnMapByGeofences(
        this.selectedSite.name,
        this.geofencesToFilter,
        this.periodInMinutes,
        this.selectedApplicationFilter,
        this.isRealTimeSearch
      )
      .then(() => {
        if (this.isAutoSyncThingsUpdate) {
          this.enableAutoSyncThingsByLastLocation();
        } else {
          this.disableAutoSyncThingsByLastLocation();
        }
      })
      .catch(() => this.notification.warning(this.NOT_FOUND, true, 5000))
      .finally(() => {
        this.isApplyingFilters = false;
        this.thingsService.updateRefreshTimeInfoHistoricPageState();
      });
  }

  public onExportThingsLatestEvents(buttonElementRef: ElementRef): void {
    this.overlayService.open<OverlayExporterComponent>(
      this.exportOverlayRef,
      buttonElementRef,
      OverlayExporterComponent,
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -30,
        offsetX: 20
      },
      {
        paramsObj: {
          siteName: this.selectedSite.name,
          email: this.userProfileService.getUserProfile().email,
          perimeters: this.geofencesToFilter,
          periodInMinutes: this.periodInMinutes,
          deviceType: this.selectedApplicationFilter,
          isRealTime: this.isRealTimeSearch
        },
        exportCallback: this.thingsService.exportThingsLatestEvents.bind(
          this.thingsService
        ),
        modalType: ExportationTypes.HistoricPage
      }
    );
  }

  private onApply2hPlusFormFilters(): void {
    this.disableAutoSyncThingsByLastLocation();

    if (this.registrationDocumentPersonInputValue) {
      this.tryToTrackThingsByDocumentOrRegistration();
    } else {
      const { id } = this.ngForm.controls.employeeName.value;
      this.tryToTrackThingsByDocument(id);
    }
  }

  private tryToTrackThingsByDocument(thingDocument: string) {
    this.isApplyingFilters = true;

    this.setDefaultDate();

    const { startHour, endHour } = this.ngForm.value;

    this.dateFrom = this.mapDateTimeToUTC(this.startDate, startHour);
    this.dateTill = this.mapDateTimeToUTC(this.endDate, endHour);
    const thingDocumentType = this.getDocumentResourceTranslation(
      this.selectedDocType
    );

    this.thingsService
      .syncThingTracking(
        null,
        {
          thingDocument,
          thingDocumentType
        },
        this.dateFrom,
        this.dateTill
      )
      .catch(err => this.showTrackingNotFoundError(err))
      .finally(() => {
        this.isApplyingFilters = false;
      });
  }

  private setDefaultDate() {
    if (!this.ngForm.value.startHour || !this.ngForm.value.endHour) {
      this.setDefaultTimeLapse();
    }
  }

  private tryToTrackThingsByDocumentOrRegistration() {
    const isFormValid = this.validate2hPlusForm();

    if (!isFormValid) {
      return;
    }

    this.isApplyingFilters = true;

    this.setDefaultDate();

    const { startHour, endHour } = this.ngForm.value;

    this.dateFrom = this.mapDateTimeToUTC(this.startDate, startHour);
    this.dateTill = this.mapDateTimeToUTC(this.endDate, endHour);

    const thingDocument = this.registrationDocumentPersonInputValue
      ? this.registrationDocumentPersonInputValue.replace(/[*-.]/g, '')
      : '';

    const document = this.getDocumentResourceTranslation(this.selectedDocType);

    this.thingsService
      .syncThingTracking(
        null,
        {
          thingDocument,
          thingDocumentType: document
        },
        this.dateFrom,
        this.dateTill
      )
      .catch(err => this.showTrackingNotFoundError(err))
      .finally(() => {
        this.isApplyingFilters = false;
      });
  }

  private validate2hPlusForm(): boolean {
    let isValid = true;

    if (!this.startDate || !this.endDate) {
      this.is2hPlusDateValid = false;
      isValid = false;
    } else {
      this.is2hPlusDateValid = true;
    }

    if (!this.registrationDocumentPersonInputValue) {
      this.is2hPlusInputValid = false;
      isValid = false;
    } else {
      this.is2hPlusInputValid = true;
    }

    return isValid;
  }

  private syncGeofencesBySite(site: Site): void {
    this.isFetchingGeofences = true;
    this.geofencesService.syncGeofencesBySite(site).finally(() => {
      this.isFetchingGeofences = false;
    });
  }

  private syncPoisBySite(site: Site) {
    this.isFetchingPois = true;
    this.poisService.syncPoisBySite(site).finally(() => {
      this.isFetchingPois = false;
    });
  }

  private updateThingsSelectOptions() {
    const filterThing = value => {
      let filterValue;

      if (value) {
        if (value.name) {
          filterValue = value.name.toLowerCase();
        } else {
          filterValue = value.toLowerCase();
        }
      }
      return this.thingsOnlyNames.filter(
        thing => (thing && thing.name.toLowerCase().indexOf(filterValue)) === 0
      );
    };

    this.thingsSelectOptions = this.thingCtrl.valueChanges.pipe(
      startWith(null),
      map((thing: any | null) =>
        thing ? filterThing(thing) : this.thingsOnlyNames.slice()
      )
    );
  }

  public displayFn(thing: ThingByName): string {
    return thing ? thing.name : undefined;
  }

  public filterValuesToAutoComplete(term: string): void {
    if (!term) {
      this.thingsService.clearFilterdThingsList();
    } else if (term.length > 3) {
      this.thingsService.updateThingFilteredListByName(term);
    }
  }

  public updateEmployeeNameSub(): void {
    const employeeNameSub = this.ngForm.controls.employeeName.valueChanges
      .pipe(
        debounceTime(500),
        map(name => this.filterValuesToAutoComplete(name))
      )
      .subscribe();

    this.subscriptions.push(employeeNameSub);
  }

  private getDocumentResourceTranslation(resourceName: string) {
    let document;

    this.translate
      .get(resourceName)
      .pipe(take(1))
      .subscribe(resource => {
        document = resource;
      });

    return document as LocationRepositoryDocumentType;
  }

  public onChangeSearchType(searchType: string): void {
    this.ngForm.reset();
    this.registrationDocumentPersonInputValue = '';
    this.selectedDocType = searchType;
    this.thingSelectedByPreviewList = this.ngForm.controls.employeeName.value
      ? this.thingSelectedByPreviewList
      : null;
  }

  private mapDateTimeToUTC(date: string, hour: string): string {
    const offSetTimeZone = new Date().getTimezoneOffset();

    return moment(`${date} ${hour}`).zone(offSetTimeZone).utc().toISOString();
  }

  private setDefaultTimeLapse(): void {
    this.ngForm.value.startHour = '00:00';
    this.ngForm.value.endHour = '23:59';
  }

  // #region MAP

  private tryExecuteCallbackOnMap(callback: () => void): void {
    if (this.googleMapRef) {
      callback();
    } else {
      const HALF_SECOND_IN_MILLISECONDS = 0.5 * 1000;

      const timerToRetry = timer(HALF_SECOND_IN_MILLISECONDS);

      timerToRetry.subscribe(() => {
        this.tryExecuteCallbackOnMap(callback);
      });
    }
  }

  private setSiteOnMap(site: Site): void {
    this.tryExecuteCallbackOnMap(() => {
      const { latitude: lat, longitude: lng, zoom } = site;

      const options: google.maps.MapOptions = { center: { lat, lng }, zoom };
      this.googleMapRef.setMap(options);
    });
  }

  private setPerimeterOnMap(perimeters: Perimeter[]): void {
    this.tryExecuteCallbackOnMap(() => {
      this.googleMapRef.setPerimetersOnMap(perimeters);
    });
  }

  private setGeofencesOnMap(
    geofences: Geofence[],
    geofencesCategories: GeofenceCategory[]
  ): void {
    this.tryExecuteCallbackOnMap(() => {
      if (geofences.length && geofencesCategories.length)
        this.googleMapRef.setGeofencesOnMap(geofences, geofencesCategories);
    });
  }

  private setGeofencesVisibilityTo(visibility: boolean): void {
    this.tryExecuteCallbackOnMap(() => {
      this.googleMapRef.setGeofencesVisibilityTo(visibility);
    });
  }

  private setThingsOnMap(things: ExtendedThing[]): void {
    this.tryExecuteCallbackOnMap(() => {
      this.googleMapRef.setThings(things);
    });
  }

  private clearThingsOnMap(): void {
    this.tryExecuteCallbackOnMap(() => {
      this.googleMapRef.clearThings();
    });
  }

  private setDeviceTraceOnMap(devicesLocation: DeviceLocation[]): void {
    this.tryExecuteCallbackOnMap(() => {
      this.googleMapRef.setDeviceTrace(devicesLocation);
    });
  }

  selectedDeviceLocationEvent(deviceLocation: DeviceLocation): void {
    this.selectedDeviceLocation = deviceLocation;
    this.googleMapRef.setMarkerAsSelectedByLocationList(deviceLocation);
  }

  sendPointToList(deviceLocation: DeviceLocation): void {
    this.historicComponentRef.receivePointFromMap(deviceLocation);
  }

  selectedThingToPosition(selectedThing: Thing): void {
    this.selectedThing = selectedThing;
  }

  clearSelectedThing(): void {
    this.selectedThing = null;
  }

  // #endregion
}
