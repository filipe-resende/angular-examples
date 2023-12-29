/* eslint-disable no-param-reassign */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MapTwoComponent } from '../../../components/smart/map-two/map-two.component';
import { BusTripConstants } from '../../../core/constants/bus-trip.const';
import { Middlewares } from '../../../core/constants/middleware.const';
import { DeviceLocation } from '../../../shared/models/device';
import { Site } from '../../../shared/models/site';
import { ExtendedThing, Thing } from '../../../shared/models/thing';
import { cloneObject } from '../../../shared/utils/clone';
import { DevicesService } from '../../../stores/devices/devices.service';
import { HeaderService } from '../../../stores/header/header.service';
import { HeaderSearchbar } from '../../../stores/header/header.state';
import { ThingsService } from '../../../stores/things/things.service';
import { HistoricEventsListComponent } from '../historic-events-list/historic-events-list.component';
import { SelectableThingTrackModel } from '../historic.page';
import { EventTypeLabels } from '../../../core/constants/event-type';
import { OverlayExporterComponent } from '../../../components/presentational/overlay-exporter/overlay-exporter.component';
import { ExportationTypes } from '../../../shared/enums/ExportationTypes';
import { OverlayService } from '../../../core/services/overlay.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { GetGeofenceNames } from '../../../shared/utils/valeLocation-helper';
import { ValeLocations } from '../../../shared/models/valeLocations';

export enum SearchTypes {
  search30min = 'search30min',
  search2h = 'search2H',
  search2hPlus = 'search2HPlus'
}

@Component({
  selector: 'app-historic-list',
  templateUrl: 'historic-list.component.html',
  styleUrls: ['historic-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoricListComponent implements OnInit, OnDestroy {
  public readonly BUS_TRIP_TRACKER_EVENT = BusTripConstants.EventType;

  @ViewChild(HistoricEventsListComponent)
  public historicEventsListRef: HistoricEventsListComponent;

  @Input()
  public filteredSingleThing: SelectableThingTrackModel;

  @Input('googleMapTwo')
  public googleMapRef: MapTwoComponent;

  @Input()
  public selectedSite: Site;

  @Input()
  public things: ExtendedThing[] = [];

  @Input()
  public intervalInMinutes: number;

  @Input()
  public searchbarText: string;

  @Input()
  public dateFrom: string;

  @Input()
  public dateTill: string;

  @Output()
  public clearMapFilteredOverlays = new EventEmitter();

  @Output()
  public setFilteredSingleThing = new EventEmitter();

  @Output()
  public showTrackingNotFoundError = new EventEmitter();

  @Output()
  public selectedDeviceLocation = new EventEmitter<DeviceLocation>();

  public deviceLocation: DeviceLocation;

  public searchbar$: Observable<HeaderSearchbar>;

  public isFetchingAllThings = false;

  private subscriptions: Subscription[] = [];

  public canViewSensitiveData: boolean;

  public facialRecognitionAdapter: string =
    Middlewares.FacialRecognitionAdapter;

  @Input()
  public shouldDistinguishSpots = false;

  public EventTypeLabels = EventTypeLabels;

  public exportOverlayRef;

  @Output() selectedThing = new EventEmitter<Thing>();

  constructor(
    private headerService: HeaderService,
    private thingsService: ThingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private userProfileService: UserProfileService,
    private devicesService: DevicesService,
    private overlayService: OverlayService
  ) {}

  public ngOnInit(): void {
    this.setupSearchbar();
    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();
    this.exportOverlayRef = this.overlayService.create();
  }

  public ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.tearDownSearchbar();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public onDrawThingTraceButtonClick(
    selectedThing: Thing | SelectableThingTrackModel
  ): void {
    const selectedThingAsThingTrack =
      selectedThing as SelectableThingTrackModel;

    if (
      selectedThingAsThingTrack.devicesLocation &&
      selectedThingAsThingTrack.devicesLocation.length > 0
    ) {
      this.googleMapRef.setDeviceTrace(
        selectedThingAsThingTrack.devicesLocation
      );
    } else {
      const { id, latitude, longitude } = selectedThing as Thing;

      this.sendSelectedThingToHistoryPage(selectedThing);
      this.isFetchingAllThings = true;

      this.thingsService
        .syncThingTracking(id, null, null, null, this.intervalInMinutes)
        .catch(err => {
          this.googleMapRef.setMapOn(latitude, longitude);
          this.showTrackingNotFoundError.emit(err);
        })
        .finally(() => {
          this.isFetchingAllThings = false;
        });
    }
  }

  public onReturnToListButtonClick(): void {
    this.resetMarkersToSiteMarkers();
    this.setFilteredSingleThing.emit(null);
    this.selectedThing.emit();
    this.onSelectThing(null);
  }

  public onClickExportButton(buttonElementRef: ElementRef): void {
    const searchType = this.setSearchTypeToExport();
    const { email } = this.userProfileService.getUserProfile();

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
          email,
          thingId: this.filteredSingleThing.thingId,
          type: searchType,
          inicialDate: this.dateFrom,
          finalDate: this.dateTill,
          selectedSite: this.selectedSite.name
        },
        exportCallback: this.thingsService.exportPathFromThing.bind(
          this.thingsService
        ),
        modalType: ExportationTypes.HistoricPage
      }
    );
  }

  private setSearchTypeToExport() {
    let searchType = '';

    switch (this.intervalInMinutes) {
      case 30:
        searchType = SearchTypes.search30min;
        break;
      case 120:
        searchType = SearchTypes.search2h;
        break;
      case null:
        searchType = SearchTypes.search2hPlus;
        break;
    }

    return searchType;
  }

  public enricherfilteredSingleThing(): SelectableThingTrackModel {
    return {
      ...this.filteredSingleThing,
      lastDeviceLocation: this.devicesService.enrichDeviceEventsMiddlewareName(
        [this.filteredSingleThing.lastDeviceLocation],
        this.shouldDistinguishSpots
      )[0]
    };
  }

  public onSelectThing(selectedThing: Thing | SelectableThingTrackModel): void {
    if (selectedThing && this.isSelectableThingTrackModel(selectedThing)) {
      this.clearMapFilteredOverlays.emit();
      const filteredSingleThing: SelectableThingTrackModel = cloneObject(
        this.filteredSingleThing
      );
      filteredSingleThing.isThingSelected =
        !filteredSingleThing.isThingSelected;

      this.setFilteredSingleThing.emit(filteredSingleThing);
    } else if (this.isFetchingAllThings === false) {
      const selectedThingArray = [];
      this.selectedThing.emit();

      this.things.forEach(thing => {
        if (thing.id === selectedThing?.id) {
          this.clearMapFilteredOverlays.emit();
          thing.isThingSelected = !thing.isThingSelected;

          if (!thing.isThingSelected) {
            this.resetMarkersToSiteMarkers();
          } else {
            const { latitude, longitude } = selectedThing as Thing;

            selectedThingArray.push(thing);
            this.googleMapRef.setMapOn(latitude, longitude);
            this.googleMapRef.setThings(selectedThingArray);
          }
        } else {
          thing.isThingSelected = false;
        }
      });
    }
  }

  public isBusMiddleware(middleware: string) {
    return (
      middleware === Middlewares.BusEventAdapter ||
      middleware?.split(' ')[0] === 'Ônibus'
    );
  }

  public verifyLastDeviceLocationMiddlewareIsBusEvent(
    filteredSingleThing?: SelectableThingTrackModel
  ): boolean {
    const middleware =
      this.verifyLastDeviceLocationMiddleware(filteredSingleThing);
    return this.isBusMiddleware(middleware);
  }

  public verifyLastDeviceLocationMiddleware(
    filteredSingleThing: SelectableThingTrackModel
  ): string {
    const middleware =
      filteredSingleThing?.devicesLocation.length > 0
        ? filteredSingleThing?.devicesLocation.slice(-1)[0].middleware
        : '';

    return middleware;
  }

  private isSelectableThingTrackModel(thing: any | SelectableThingTrackModel) {
    return !!(thing as SelectableThingTrackModel).devicesLocation;
  }

  private setupSearchbar(): void {
    this.searchbar$ = this.headerService.searchbar$;

    this.headerService.updateSearchbar({
      placeholder: 'MESSAGES.FILTER_BY_NAME_DOC_DEVICE'
    });
  }

  private tearDownSearchbar(): void {
    this.headerService.updateSearchbarVisibilityTo(false);
  }

  private resetMarkersToSiteMarkers() {
    this.googleMapRef.clearTraceMarker();

    const { latitude, longitude, zoom } = this.selectedSite;

    this.googleMapRef.setMapOn(latitude, longitude, zoom);

    const thingsFilted = this.things.filter(
      thing =>
        thing.name.toLowerCase().includes(this.searchbarText) ||
        thing.deviceId.toLowerCase().includes(this.searchbarText) ||
        thing.deviceType.toLowerCase().includes(this.searchbarText) ||
        thing.document.toLowerCase().includes(this.searchbarText)
    );
    this.googleMapRef.setThings(thingsFilted);
  }

  public isFacialRecognitionMiddleware(middleware: string) {
    return middleware === Middlewares.FacialRecognitionAdapter;
  }

  public isSmartBadgeMiddleware(middleware: string) {
    return middleware === Middlewares.SmartBadge;
  }

  public verifyLastDeviceLocationReaderMiddleware(
    filteredSingleThing: SelectableThingTrackModel
  ): boolean {
    const middleware =
      filteredSingleThing?.devicesLocation.length > 0
        ? filteredSingleThing?.devicesLocation[
            filteredSingleThing?.devicesLocation.length - 1
          ].middleware
        : '';
    return this.isReaderMiddleware(middleware);
  }

  public isReaderMiddleware(middleware: string): boolean {
    return (
      middleware === Middlewares.SecurityCenter ||
      middleware.replace(/\s/g, ' ') === Middlewares.SecurityCenter ||
      middleware === Middlewares.PortableBadgeReader ||
      middleware === Middlewares.PortableBadgeReaderIot ||
      middleware === Middlewares.PortableBadgeReaderAlutel
    );
  }

  public verifyLastDeviceLocationFacialMiddleware(
    filteredSingleThing: SelectableThingTrackModel
  ): boolean {
    const middleware =
      filteredSingleThing?.devicesLocation.length > 0
        ? filteredSingleThing?.devicesLocation[
            filteredSingleThing?.devicesLocation.length - 1
          ].middleware
        : '';
    return this.isFacialRecognitionMiddleware(middleware);
  }

  public sendPointToMap(deviceLocation: DeviceLocation): void {
    this.selectedDeviceLocation.emit(deviceLocation);
  }

  public sendSelectedThingToHistoryPage(selectedThing: Thing): void {
    this.selectedThing.emit(selectedThing);
  }

  public receivePointFromMap(deviceLocation: DeviceLocation): void {
    if (this.historicEventsListRef) {
      this.historicEventsListRef.setSelectedLocation(deviceLocation);
    }
  }

  public showValeLocations(
    valeLocations: ValeLocations[],
    isItForExport: boolean
  ): string {
    return GetGeofenceNames(valeLocations, isItForExport);
  }
}
