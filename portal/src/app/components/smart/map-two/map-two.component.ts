/* eslint no-param-reassign: "warn" */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ApplicationsIds } from '../../../core/constants/applications-ids';
import { BusTripConstants } from '../../../core/constants/bus-trip.const';
import { EventDirection } from '../../../core/constants/event-directions';
import { Middlewares } from '../../../core/constants/middleware.const';
import { SaloboDeviceGroups } from '../../../core/constants/salobo-device-groups.enum';
import { OFFICIAL_PERIMETER_COLOR } from '../../../shared/enums/valeColors';
import { DeviceLocation } from '../../../shared/models/device';
import { Geofence } from '../../../shared/models/geofence';
import GeofenceCategory from '../../../shared/models/geofence-category';
import { Perimeter } from '../../../shared/models/perimeter';
import { ExtendedThing } from '../../../shared/models/thing';
import {
  isAuthorizedEntrance,
  isAuthorizedExit,
  isDeniedEntrance,
  isDeniedExit
} from '../../../shared/utils/location-events-helpers/location-events-helpers';
import { DevicesService } from '../../../stores/devices/devices.service';
import { ThingsService } from '../../../stores/things/things.service';
import {
  InfoWindowFactory,
  InfoWindowTypes,
  UserDetailsInfoWindow
} from '../map/info-window.factory';

declare const MarkerClusterer: any;

type Coordinate = {
  lat: number;
  lng: number;
};

@Component({
  selector: 'app-map-two',
  templateUrl: './map-two.component.html',
  styleUrls: ['./map-two.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapTwoComponent implements OnInit, AfterViewInit {
  @Input()
  public name: string;

  @Input()
  public shouldDistinguishSpots = false;

  @Output() public showDeviceTrace = new EventEmitter();

  @Output() selectedDeviceLocation = new EventEmitter<DeviceLocation>();

  public showAllGeofencesToggle = true;

  public geofencesList: Geofence[] = [];

  public filteredGeofences: google.maps.Polygon[] = [];

  @Output() public legend: boolean;

  public perimeters: google.maps.Polygon[] = [];

  public markedGeofences: google.maps.Polygon[] = [];

  public geofenceDetailsFromMarkedGeofences: google.maps.Marker[] = [];

  private geofences: google.maps.Polygon[] = [];

  private fencesDictionary: any;

  private geofencesDetails: google.maps.Marker[] = [];

  private map: google.maps.Map;

  private LAST_LOCATION: string;

  private REPORTED_DEVICE: string;

  private SEE_TRACK: string;

  private LOADING_TEXT: string;

  private thingsMarkers: google.maps.Marker[] = [];

  private thingsCluster: any;

  private pathBetweenArray: any = [];

  private traceMarkers: google.maps.Marker[] = [];

  public fencesNames: any;

  constructor(
    private infoWindowFactory: InfoWindowFactory,
    private translate: TranslateService,
    private deviceService: DevicesService,
    private thingsService: ThingsService
  ) {}

  ngOnInit(): void {
    this.setupTranslations();
  }

  ngAfterViewInit(): void {
    this.setMap();
  }

  clearGeofences(): void {
    this.geofences = [];
  }

  public toggleAllGeofences(toggleEvent): void {
    this.showAllGeofencesToggle = toggleEvent.source
      ? toggleEvent.checked
      : toggleEvent;

    this.setGeofencesVisibilityTo(this.showAllGeofencesToggle);
  }

  public setMap(options?: google.maps.MapOptions): void {
    const finalOptions: google.maps.MapOptions = {
      ...options,
      mapTypeId: (options && options.mapTypeId) || 'satellite'
    };

    this.map = new google.maps.Map(
      document.getElementById(this.name),
      finalOptions
    );
  }

  public setHeatMap(coordinates: Coordinate[]): void {
    const data = coordinates.map(({ lat, lng }) => {
      return new google.maps.LatLng({ lat, lng });
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data
    });

    heatmap.setMap(this.map);
  }

  public setMapOn(lat: number, lng: number, zoom?: number): void {
    this.map.panTo({ lat, lng });

    if (zoom) {
      this.map.setZoom(zoom);
    }
  }

  private setPolygonOnMap(polygon: google.maps.Polygon) {
    polygon.setMap(this.map);
  }
  // #region PERIMETER

  public setPerimetersOnMap(perimeters: Perimeter[]): void {
    const perimetersPolygons = perimeters.map(this.mapPerimeterToPolygon);
    this.perimeters = perimetersPolygons;

    perimetersPolygons.forEach(this.setPolygonOnMap.bind(this));
  }

  // #endregion

  // #region GEOFENCE

  public setGeofencesOnMap(
    geofences: Geofence[],
    geofenceCategories: GeofenceCategory[]
  ): void {
    const geofencesPolygons = geofences.map(this.mapGeofenceToPolygon);
    this.geofences = geofencesPolygons;
    this.fencesDictionary = {};

    for (let i = 0; i < this.geofences.length; i++) {
      this.geofences[i].setValues({
        id: geofences[i].id,
        categoryId: geofences[i].categoryId
      });
      this.fencesDictionary[geofences[i].name] = i;
    }

    geofencesPolygons.forEach(this.setPolygonOnMap.bind(this));

    this.setGeofencesDetails(geofences, geofenceCategories);
  }

  public setFilteredGeofencesToPolygon(geofences: Geofence[]): void {
    const filteredGeofencesPolygons = geofences.map(this.mapGeofenceToPolygon);
    this.filteredGeofences = filteredGeofencesPolygons;

    for (let i = 0; i < this.filteredGeofences.length; i++) {
      this.filteredGeofences[i].setValues({
        id: geofences[i].id
      });
    }

    this.setGeofencesVisibilityTo(false, this.filteredGeofences);
  }

  public setGeofencesVisibilityTo(
    visibility: boolean,
    filter?: google.maps.Polygon[]
  ): void {
    if (filter != null) {
      this.geofences.forEach(g =>
        this.filteredGeofences.forEach(fg => {
          if (g.get('id') === fg.get('id')) this.markedGeofences.push(g);
        })
      );

      this.geofences.forEach(g => {
        if (this.markedGeofences.includes(g)) g.setVisible(true);
        else g.setVisible(false);
      });

      this.setGeofencesDetailsVisibilityTo(
        visibility,
        false,
        this.markedGeofences
      );
    } else if (this.markedGeofences.length === 0) {
      this.geofences.forEach(g => g.setVisible(visibility));
      this.setGeofencesDetailsVisibilityTo(visibility, true);
    } else {
      this.markedGeofences.forEach(g => g.setVisible(visibility));
      this.setGeofencesDetailsVisibilityTo(visibility, true);
    }
  }

  private setGeofencesDetailsVisibilityTo(
    visibility: boolean,
    isFilterEmpy?: boolean,
    markedGeofences?: google.maps.Polygon[]
  ): void {
    if (isFilterEmpy) {
      if (this.geofenceDetailsFromMarkedGeofences.length === 0) {
        this.geofencesDetails.forEach(geofenceDetail =>
          geofenceDetail.setVisible(visibility)
        );
      } else {
        this.geofenceDetailsFromMarkedGeofences.forEach(geofenceDetail =>
          geofenceDetail.setVisible(visibility)
        );
      }
    } else {
      this.geofencesDetails.forEach(gd =>
        markedGeofences.forEach(mk => {
          if (gd.get('id') === mk.get('id'))
            this.geofenceDetailsFromMarkedGeofences.push(gd);
        })
      );

      this.geofencesDetails.forEach(gd => {
        if (this.geofenceDetailsFromMarkedGeofences.includes(gd))
          gd.setVisible(true);
        else gd.setVisible(false);
      });

      this.showAllGeofencesToggle = true;
    }
  }

  private setGeofencesDetails(
    geofences: Geofence[],
    geofenceCategories: GeofenceCategory[]
  ) {
    const validGeofences = geofences.map(geofence => {
      const category = geofenceCategories.find(
        ({ id }) => geofence.categoryId === id
      );
      return { geofence, category };
    });

    const validGeofenceWithCategory = validGeofences.filter(
      ({ category }) => !!category
    );

    this.geofencesDetails = validGeofenceWithCategory.map(
      ({ geofence, category }) =>
        this.setGeofenceDetailsOnInfoWindow(geofence, category)
    );

    for (let i = 0; i < this.geofencesDetails.length; i++) {
      this.geofencesDetails[i].setValues({
        id: geofences[i].id
      });
    }
  }

  private setGeofenceDetailsOnInfoWindow(
    geofence: Geofence,
    geofenceCategory: GeofenceCategory
  ): google.maps.Marker {
    const infoWindow = this.getGeofenceDetailsInfoWindow(
      geofence,
      geofenceCategory
    );

    return this.setGeofenceDetailsMarker(geofence, infoWindow);
  }

  // #endregion

  // #region THINGS

  public setThings(things: ExtendedThing[]): void {
    this.legend = false;
    this.clearThings();

    const thingsEnrich =
      this.thingsService.enrichEventsMiddlewareNameAndTypeAccess(
        things,
        this.shouldDistinguishSpots
      );

    this.thingsMarkers = thingsEnrich.map(thing => {
      return this.setThingIntoMarker(thing);
    });

    this.thingsCluster = this.setMarkersCluster(this.thingsMarkers);
    this.setLegendOnMap();
  }

  private setLegendOnMap(): void {
    if (this.shouldDistinguishSpots) {
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        document.getElementById('legend')
      );
      this.legend = true;
    }
  }

  public clearThings(): void {
    this.thingsMarkers = [];

    if (this.thingsCluster) {
      this.thingsCluster.clearMarkers();
    }
  }

  public setDeviceTrace(devicesList: DeviceLocation[]): void {
    this.clearTraceMarker();
    const letDevicesPosition = [];
    const bounds = new google.maps.LatLngBounds();
    const lastElementIndex = devicesList.length - 1;

    let deviceLatLng = {
      lat: 0,
      lng: 0
    };

    const enrichDeviceEventsMiddlewareName =
      this.deviceService.enrichDeviceEventsMiddlewareName(
        devicesList,
        this.shouldDistinguishSpots
      );

    enrichDeviceEventsMiddlewareName.forEach((device: DeviceLocation) => {
      const index = enrichDeviceEventsMiddlewareName.indexOf(device, 0);
      let icon;

      deviceLatLng = {
        lat: device.latitude,
        lng: device.longitude
      };
      bounds.extend(deviceLatLng);
      letDevicesPosition.push(deviceLatLng);

      if (index === 0) {
        icon = {
          url: `/assets/icons/startFlag.svg`,
          scaledSize: new google.maps.Size(35, 35)
        };
      }

      if (index === lastElementIndex) {
        icon = {
          url: `/assets/icons/endFlag.svg`,
          scaledSize: new google.maps.Size(35, 35)
        };
      }

      if (index !== 0 && index !== lastElementIndex) {
        icon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 3,
          strokeColor: '#3d7edb',
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: '#3d7edb',
          fillOpacity: 1
        };
      }

      const marker = new google.maps.Marker({
        position: deviceLatLng,
        icon,
        map: this.map
      });

      device.index = index;

      this.setPropertiesToMarkLocationOnMap(marker, index);
      this.setTraceMarkerInfoWindow(device, marker);
    });

    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5,
      strokeWeight: 2,
      strokeColor: '#f44336',
      strokeOpacity: 1.0,
      fillColor: '#f44336',
      fillOpacity: 1,
      zIndex: 99999
    };

    const line = new google.maps.Polyline({
      path: letDevicesPosition,
      strokeColor: '#ffffff',
      geodesic: false,
      editable: false,
      strokeOpacity: 1.0,
      strokeWeight: 2,
      icons: [
        {
          icon: lineSymbol
        }
      ],
      map: this.map
    });

    this.pathBetweenArray.push(line);
    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);
    this.setTraceMarker();
    this.animateCircle(line);
  }

  setPropertiesToMarkLocationOnMap(
    marker: google.maps.Marker,
    index: number
  ): void {
    marker.setValues({ isSelected: false });
    marker.setValues({ index });
  }

  private setThingIntoMarker(thing: ExtendedThing): google.maps.Marker {
    const marker = this.mapThingToMarker(thing);

    this.setMarkerInfoWindow(thing, marker);

    return marker;
  }

  // #endregion

  // #region MAPPERS

  private mapPerimeterToPolygon({
    coordinates
  }: Perimeter): google.maps.Polygon {
    return new google.maps.Polygon({
      paths: coordinates,
      strokeColor: OFFICIAL_PERIMETER_COLOR,
      strokeOpacity: 1.0,
      strokeWeight: 3,
      fillOpacity: 0,
      clickable: false
    });
  }

  private mapGeofenceToPolygon({
    coordinates,
    color
  }: Geofence): google.maps.Polygon {
    return new google.maps.Polygon({
      paths: coordinates,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 3,
      fillColor: color,
      fillOpacity: 0
    });
  }

  private mapThingToMarker({
    showAlert,
    name,
    latitude: lat,
    longitude: lng,
    middleware,
    deviceCategoryName,
    applicationId,
    eventDirection,
    eventType
  }: ExtendedThing): google.maps.Marker {
    let iconName;

    if (this.shouldDistinguishSpots && applicationId === ApplicationsIds.SPOT) {
      switch (deviceCategoryName) {
        case SaloboDeviceGroups.Fixed:
          iconName = 'SpotFixed';
          break;
        case SaloboDeviceGroups.SLBIII:
          iconName = 'SpotSLBIII';
          break;
        default:
          iconName = 'SpotFloating';
      }
    } else {
      iconName = this.getMiddlewareIconName(
        middleware,
        showAlert,
        eventDirection,
        eventType
      );
    }

    const icon = {
      url: `/assets/icons/${iconName}.svg`,
      scaledSize: new google.maps.Size(35, 35)
    };

    return new google.maps.Marker({
      icon,
      title: name,
      map: this.map,
      position: { lat, lng },
      animation: google.maps.Animation.DROP
    });
  }

  private getMiddlewareIconName(
    middleware: string,
    showAlert?: boolean,
    eventDirection?: string,
    eventType?: string
  ): string {
    let iconName: string;

    switch (middleware) {
      case Middlewares.SecurityCenter:
        iconName = this.getSecurityCenterIconName(eventType, eventDirection);
        break;

      case Middlewares.SharingSafety:
        iconName = 'Sharing Safety';
        break;

      case Middlewares.SmartBadge:
        iconName = 'SmartBadge';
        break;

      case Middlewares.Spot:
        iconName = 'SPOT';
        break;

      case Middlewares.Bus:
        if (eventType === BusTripConstants.EventType) {
          if (eventDirection === EventDirection.Exit) {
            iconName = 'BusExiting';
          } else {
            iconName = 'BusEntrance';
          }
        } else {
          iconName = 'BusMiddleware';
        }
        break;

      case Middlewares.FacialRecognitionAdapter:
        iconName = 'facial-recognition';
        break;

      case Middlewares.PortableBadgeReader:
      case Middlewares.PortableBadgeReaderIot:
      case Middlewares.PortableBadgeReaderAlutel:
        iconName = 'PortableBadgeReader';
        break;

      default:
        iconName = 'icon-default';
        break;
    }

    const alertMessage = showAlert ? '-alert' : '';

    return `${iconName}${alertMessage}`;
  }

  private getSecurityCenterIconName(eventType: string, eventDirection: string) {
    const thing = {
      eventType,
      eventDirection
    };
    let iconName = 'SecurityCenter';

    if (isDeniedEntrance(thing)) {
      iconName = 'securityCenter_deniedEntrance';
    } else if (isDeniedExit(thing)) {
      iconName = 'securityCenter_deniedExit';
    } else if (isAuthorizedEntrance(thing)) {
      iconName = 'securityCenter_authorizedEntrance';
    } else if (isAuthorizedExit(thing)) {
      iconName = 'securityCenter_authorizedExit';
    }

    return iconName;
  }

  // #endregion

  // #region INFO WINDOWS

  private getGeofenceDetailsInfoWindow(
    geofence: Geofence,
    geofenceCategory: GeofenceCategory
  ) {
    const content = this.getGeofenceDetailsInfoWindowContent(
      geofence,
      geofenceCategory
    );

    return new google.maps.InfoWindow({
      content
    });
  }

  private getGeofenceDetailsInfoWindowContent(
    { name: geofenceName }: Geofence,
    { name: categoryName }: GeofenceCategory
  ): string {
    return `
    <div class="fences-details" >
      <div class="fences-details__header">
        <div>${geofenceName || ''}</div>
      </div>
      <div class="fences-details__divisor" ></div>
      <div class="fences-details__content">
        <div>Categoria: ${this.fencesNames[categoryName] || ''}</div>
      </div>
    </div>`;
  }

  private setMarkerInfoWindow(
    thing: ExtendedThing,
    marker: google.maps.Marker
  ) {
    const userInfoWindowFactory = this.infoWindowFactory.createInfoWindow(
      InfoWindowTypes.userDetails
    ) as UserDetailsInfoWindow;

    userInfoWindowFactory.lastLocation = this.LAST_LOCATION;
    userInfoWindowFactory.reportedDevice = this.REPORTED_DEVICE;
    userInfoWindowFactory.seeTrackText = this.SEE_TRACK;

    const infoWindow = userInfoWindowFactory.createUserDetailsInfoWindow(thing);

    marker.addListener(
      'click',
      (scope => {
        return () => {
          infoWindow.open(this.map, marker);

          const infoEventListener = () => {
            const info = document.getElementById('infoWindowButton');
            info.innerText = scope.LOADING_TEXT;
            scope.showDeviceTrace.emit(thing);
          };

          infoWindow.addListener('domready', () => {
            const info = document.getElementById('infoWindowButton');
            info.addEventListener('click', infoEventListener);
          });
        };
      })(this)
    );
  }

  private setTraceMarkerInfoWindow(device: DeviceLocation, marker): void {
    if (google) {
      const header = `
      <div class="map-info-window-header" style="justify-content:space-between">
        <span>
          ${
            device.middleware === Middlewares.FacialRecognitionAdapter
              ? `${device.middleware}`
              : `${device.middleware} - ${device.deviceId}`
          } 
        </span>
      </div>`;
      const content = `
        <div style="padding: 16px">
          ${header}
          ${
            device.middleware === Middlewares.FacialRecognitionAdapter
              ? `
          <div class="map-info-window-content-item">
            Câmera: 
              <span>
                ${device.cameraName.slice(0, 35)}...
              </span>
          </div>`
              : ''
          } 
          ${
            device.middleware.replace(/\s/g, ' ') ===
              Middlewares.SecurityCenter ||
            device.middleware === Middlewares.PortableBadgeReader
              ? `
          <div class="map-info-window-content-item">
            Leitor: 
              <span>
                ${device.cameraName.slice(0, 35)}...
              </span>
          </div>`
              : ''
          }     
          ${
            device.middleware === Middlewares.SmartBadge
              ? `
          <div class="map-info-window-content-item">
            Rede: 
              <span>
                ${device.networkType}
              </span>
          </div>`
              : ''
          }        
          <div class="map-info-window-content-item">
              Registro: 
              <span>
                ${moment(device.eventDateTime.toString()).format(
                  'DD/MM/YYYY HH:mm'
                )}
              </span>
          </div>
          <div class="map-info-window-content-item">
              ${'Latitude'}:
              <span>
                ${device.latitude}
              </span>
          </div>
          <div class="map-info-window-content-item">
              ${'Longitude'}:
              <span>
                ${device.longitude}
              </span>
          </div>
          ${
            device.middleware === Middlewares.BusEventAdapter ||
            device.middleware.split(' ')[0] === 'Ônibus'
              ? `<div class="map-info-window-content-item">
                ${'Placa'}:
                <span>
                  ${device.licensePlate}
                </span>
              </div>
            <div class="map-info-window-content-item">
                ${'Linha'}:
                <span>
                  ${device.line}
                </span>
            </div>`
              : ''
          }
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content
      });

      marker.addListener('click', () =>
        this.openInfoMarkerWithAutoCloser(infoWindow, marker, 10000)
      );

      marker.addListener('click', () =>
        this.setMarkerAsSelected(marker, device)
      );
      this.traceMarkers.push(marker);
    }
  }

  private setMarkerAsSelected(
    marker: google.maps.Marker,
    device: DeviceLocation
  ) {
    const oldSelectedMarker = this.traceMarkers.find(m =>
      m.get('isSelected')
    ) as any;

    if (oldSelectedMarker) {
      this.removeSelectedMarker(oldSelectedMarker);
    }

    this.setSeletedMarker(marker);
    this.selectedDeviceLocation.emit(device);
  }

  removeSelectedMarker(marker: any) {
    marker.set('isSelected', false);
    const markIcon = marker.getIcon();
    markIcon.scale = 3;
    markIcon.strokeColor = '#3d7edb';
    marker.setIcon(markIcon);
  }

  setSeletedMarker(marker: any) {
    marker.set('isSelected', true);
    const icon = marker.getIcon();
    icon.scale = 8;
    icon.strokeColor = '#FFFFFF';
    marker.setIcon(icon);
  }

  setMarkerAsSelectedByLocationList(deviceLocation: DeviceLocation) {
    const actualMarkerSelected = this.traceMarkers.find(m =>
      m.get('isSelected')
    );
    if (actualMarkerSelected) this.removeSelectedMarker(actualMarkerSelected);

    const markerToSelect = this.traceMarkers.find(
      m => m.get('index') === deviceLocation.index
    ) as any;

    this.setMapOn(
      markerToSelect.getPosition().lat(),
      markerToSelect.getPosition().lng()
    );
    this.setSeletedMarker(markerToSelect);
  }

  private openInfoMarkerWithAutoCloser(
    infoWindow,
    marker,
    autoCloseTimeout: number
  ) {
    infoWindow.open(this.map, marker);

    setTimeout(() => {
      infoWindow.close();
    }, autoCloseTimeout);
  }

  // #endregion

  // #region MARKERS
  private highlightPolygon(fenceName: string, highlight: boolean): void {
    const index = this.fencesDictionary[fenceName];

    if (highlight) {
      this.geofences[index].setOptions({ fillOpacity: 0.35 });
    } else {
      this.geofences[index].setOptions({ fillOpacity: 0 });
    }
  }

  private setGeofenceDetailsMarker(
    geofence: Geofence,
    infoWindow: google.maps.InfoWindow
  ): google.maps.Marker {
    const marker = new google.maps.Marker({
      map: this.map,
      position: geofence.coordinates[0],
      icon: `/assets/icons/infoMarker.svg`,
      animation: google.maps.Animation.DROP
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
      this.highlightPolygon(geofence.name, true);
    });
    infoWindow.addListener('closeclick', () =>
      this.highlightPolygon(geofence.name, false)
    );
    return marker;
  }

  public setTraceMarker(): void {
    this.traceMarkers.forEach((marker: any) => {
      marker.setMap(this.map);
    });
  }

  public clearTraceMarker(): void {
    this.traceMarkers.forEach((marker: google.maps.Marker) => {
      marker.setMap(null);
    });

    this.pathBetweenArray.forEach((pathBetween: any) => {
      pathBetween.setMap(null);
    });

    this.traceMarkers = [];
  }

  // #endregion

  // #region CLUSTER

  private setMarkersCluster(markers: google.maps.Marker[]) {
    const options = {
      maxZoom: 18,
      minimumClusterSize: 2,
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      zoomOnClick: true
    };

    return new MarkerClusterer(this.map, markers, options);
  }
  // #endregion

  // #region TRANSLATION

  private setupTranslations() {
    this.translate.get(['MAP', 'MAIN', 'FENCES']).subscribe(resources => {
      const {
        MAP: { SEE_TRACK, REPORTED_DEVICE, LAST_LOCATION },
        MAIN: { LOADING },
        FENCES: { VIRTUAL_FENCE, RADIUS_FENCE }
      } = resources;

      this.fencesNames = { VIRTUAL_FENCE, RADIUS_FENCE };
      this.LOADING_TEXT = LOADING;
      this.SEE_TRACK = SEE_TRACK;
      this.REPORTED_DEVICE = REPORTED_DEVICE;
      this.LAST_LOCATION = LAST_LOCATION;
    });
  }

  // #endregion

  private animateCircle(line) {
    let count = 0;
    window.setInterval(() => {
      count++;

      const icons = line.get('icons');
      icons[0].offset = `${count}px`;
      line.set('icons', icons);
    }, 1);
  }
}
