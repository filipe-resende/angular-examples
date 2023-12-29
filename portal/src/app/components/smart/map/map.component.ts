/* eslint no-param-reassign: "warn" */
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
  Renderer2,
  OnDestroy
} from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { OverlappingMarkerSpiderfier } from 'ts-overlapping-marker-spiderfier';
import { Subscription } from 'rxjs';
import { GeofencesService } from '../../../stores/geofences/geofences.service';
import { MapSetup } from './map.setup';
import { ExtendedThing } from '../../../shared/models/thing';
import { Perimeter } from '../../../shared/models/perimeter';
import { PerimetersService } from '../../../stores/perimeters/perimeters.service';
import { OFFICIAL_PERIMETER_COLOR } from '../../../shared/enums/valeColors';
import { Geofence } from '../../../shared/models/geofence';
import {
  InfoWindowTypes,
  InfoWindowFactory,
  FencesDetailsInfoWindow,
  UserDetailsInfoWindow
} from './info-window.factory';

declare let google: any;
declare let MarkerClusterer: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, OnDestroy {
  // #region [DECLARATIONS]

  @Output() public showDeviceTrace = new EventEmitter();

  public map: any;

  public oms: any;

  public cluster;

  public markers: any = [];

  public traceMarkers: any = [];

  public maximumOfPolylines?: number;

  public polyLines = [];

  public polylineMarkers: any = [];

  public polylineMarkerClickEvent: any;

  public pathBetween;

  public pathBetweenArray: any = [];

  public geofenceArea;

  public geofenceAreaArray: any = [];

  public geofenceInfoMarkers: any = [];

  public perimetersArray: any = [];

  public shouldDisplayPerimeters = true;

  public shouldDisplayFences = true;

  public officialPerimetersAreaArray: any = [];

  public officialPerimetersClickEvent: any;

  public poiMarker: any;

  public poisMarkers: any = [];

  public poiMarkerClickEvent: any;

  public poiMarkerData = {
    lat: 0,
    lng: 0
  };

  private heatmap;

  private LOADING_TEXT = 'Loading';

  private DESCRIPTION: string;

  private subscriptions: Subscription[] = [];

  FENCES_CATEGORY: any;

  SEE_TRACK: any;

  REPORTED_DEVICE: any;

  LAST_LOCATION: any;

  constructor(
    private translate: TranslateService,
    private renderer2: Renderer2,
    private mapSetup: MapSetup,
    private perimetersService: PerimetersService,
    private geofencesService: GeofencesService,
    private infoWindowFactory: InfoWindowFactory
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).google;
    }
  }

  // #endregion

  public ngOnInit(): void {
    this.setupMapAndOms();
    this.setupTranslations();

    if (this.isPerimetersPage()) {
      this.clearPerimetersFromMap();
      this.shouldDisplayPerimeters = false;
    }

    this.onPerimetersChangeHandler();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Realiza o setup do mapa. Chamar este método sempre que desejar initilizar o mapa na página/componente.
   * @param lat latitude para centralizar mapa
   * @param lng longitude para centralizar mapa
   * @param zoom zoom para aplicar no mapa
   */
  public initMap(lat: number, lng: number, zoom: number, type?: string): void {
    this.clearMap();

    this.mapSetup.setup(lat, lng, zoom, this.map, this.renderer2, type);
  }

  /**
   * Limpa tudo do mapa;
   */
  public clearMap(): void {
    this.clearMarkers();
    this.clearPolygon();
    this.clearPolygonArray();
    this.clearPolyline();
    this.clearPoiMarkers();
  }

  /**
   * Move a visão do mapa para uma posicao especifica
   * @param position dados para reposicionamento do visor do mapa
   */
  public panTo(position: {
    latitude: number;
    longitude: number;
    zoom?: number;
  }): void {
    if (position.zoom) {
      this.map.setZoom(position.zoom);
    }
    this.map.panTo({ lat: position.latitude, lng: position.longitude });
  }

  // #region [HEATMAP]

  /**
   * Limpa heatmap
   */
  public clearHeatMap(): void {
    if (this.heatmap) {
      this.heatmap.setMap(null);
    }
  }

  /**
   * Converte coordenadas em um heatmap e o adiciona no mapa
   * @param coordinates coordenadas para montar o heatmap
   */
  public setHeatMap(
    coordinates: Array<{ latitude: number; longitude: number }>
  ): void {
    const heatmapData = [];
    let myLatLng = {
      lat: 0,
      lng: 0
    };

    coordinates.forEach((coordinate: any) => {
      myLatLng = {
        lat: coordinate.latitude,
        lng: coordinate.longitude
      };

      heatmapData.push({
        location: new google.maps.LatLng(myLatLng)
      });
    });

    this.clearHeatMap();

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData
    });

    this.heatmap.setMap(this.map);
  }

  // #endregion

  // #region [MARKERS]

  /**
   * Remove markers do mapa
   */
  public clearMarkers(): void {
    if (this.cluster) {
      this.cluster.clearMarkers();
      this.markers = [];
      this.cluster = null;
    }
  }

  /**
   * Transforma things do tipo ExtendedThing
   * @param things things para serem adicionadas como markers no mapa
   * @param animation pode informar a animação desejada para o aparecimento dos markers. default = google.maps.Animation.DROP
   */
  public setMapMarkers(
    things: ExtendedThing[],
    animation = google.maps.Animation.DROP
  ): void {
    if (google) {
      let myLatLng = {
        lat: 0,
        lng: 0
      };

      things.forEach((thing: ExtendedThing) => {
        myLatLng = {
          lat: thing.latitude,
          lng: thing.longitude
        };
        const icon = {
          url: `/assets/icons/${thing.deviceType}${
            thing.showAlert ? '-alert' : ''
          }.svg`,
          scaledSize: new google.maps.Size(35, 35)
        };
        const marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          icon,
          animation,
          title: thing.name
        });
        this.setMarkerInfoWindow(thing, marker);
      });
      this.setMarkersCluster();
    }
  }

  public toggleMarkerBounce(marker): void {
    if (google) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
  }

  // #endregion

  // #region [POLYGONS]
  public removePolylineMarkerClickEvent(clickEvent: any) {
    google.maps.event.removeListener(clickEvent);
  }

  public setPolylineMarkerClickEvent(listenerToogle: boolean): void {
    if (google) {
      if (listenerToogle) {
        this.map.setOptions({ draggableCursor: 'crosshair' });

        if (this.polylineMarkerClickEvent) {
          this.removePolylineMarkerClickEvent(this.polylineMarkerClickEvent);
        }

        this.polylineMarkerClickEvent = this.map.addListener('click', event => {
          this.geofencesService.setNewPolylineMarker(event, this.map);
        });
      } else {
        this.removePolylineMarkerClickEvent(this.polylineMarkerClickEvent);
      }
    }
  }

  public setPolygon(geofence): void {
    if (geofence && google) {
      this.geofenceArea = new google.maps.Polygon({
        paths: geofence.coordinates,
        strokeColor: geofence.color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: geofence.color,
        fillOpacity: 0,
        clickable: false,
        content: geofence.name
      });

      this.setFencesDetailsMarkers(geofence);
      this.geofenceArea.setMap(this.map);
      this.geofenceAreaArray.push(this.geofenceArea);
    }
  }

  private highlightPolygon(geofence: any, highlight: boolean): void {
    const fence = this.geofenceAreaArray.find(
      ({ content }) => content === geofence.name
    );

    if (highlight) {
      fence.setOptions({ fillOpacity: 0.35 });
    } else {
      fence.setOptions({ fillOpacity: 0 });
    }
  }

  public clearPolygon(): void {
    if (this.geofenceArea) {
      this.geofenceArea.setMap(null);
    }
  }

  public clearPolygonArray(): void {
    this.geofenceAreaArray.forEach((geofence: any) => {
      geofence.setMap(null);
    });
    this.geofenceAreaArray = [];
  }

  public clearFencesDetailsMarkers(): void {
    this.geofenceInfoMarkers.forEach(marker => marker.setMap(null));
  }

  // #endregion

  // #region [OFFICIALPERIMETERS]

  public setOfficialPerimeters(perimeter: Perimeter): void {
    if (perimeter && google) {
      perimeter.coordinates.forEach(polygonOfMultiPolygon => {
        const officialPerimetersArea = new google.maps.Polygon({
          paths: [polygonOfMultiPolygon],
          strokeColor: OFFICIAL_PERIMETER_COLOR,
          strokeOpacity: 1.0,
          strokeWeight: 3,
          fillOpacity: 0.3,
          fillColor: OFFICIAL_PERIMETER_COLOR
        });

        officialPerimetersArea.addListener('click', event => {
          const infoWindow = new google.maps.InfoWindow();
          infoWindow.setContent(`
            <div class="polygon-infowindow">
              ${perimeter.perimeterName}
            </div>
          `);
          infoWindow.setPosition(event.latLng);
          infoWindow.open(this.map);

          setTimeout(() => {
            infoWindow.close();
          }, 5000);
        });

        officialPerimetersArea.setMap(this.map);
        this.officialPerimetersAreaArray.push(officialPerimetersArea);
      });
    }
  }

  public clearOfficialPerimetersArray(): void {
    this.officialPerimetersAreaArray.forEach((perimeters: any) => {
      perimeters.setMap(null);
    });

    this.officialPerimetersAreaArray = [];
  }

  public enableOfficialPerimeterPolygonCreation(): void {
    if (google) {
      this.map.setOptions({ draggableCursor: 'crosshair' });
      this.officialPerimetersClickEvent = this.map.addListener(
        'click',
        ({ latLng }) => {
          this.perimetersService.draw.addMarker(
            latLng.lat(),
            latLng.lng(),
            this.map
          );
        }
      );
    }
  }

  public disableOfficialPerimeterPolygonCreation(): void {
    if (google) {
      this.map.setOptions({ draggableCursor: '' });
      google.maps.event.removeListener(this.officialPerimetersClickEvent);
    }
  }

  public isPerimetersPage(): boolean {
    return document.location.pathname === '/perimeters';
  }

  // #endregion

  // #region

  public clearPolyline(): void {
    this.pathBetweenArray.forEach((pathBetween: any) => {
      pathBetween.setMap(null);
    });
    this.polylineMarkers.forEach((marker: any) => {
      marker.setMap(null);
    });
    this.pathBetweenArray = [];
    this.polylineMarkers = [];
  }

  // #endregion

  // #region [POI]

  public setPoiMarker(poi): void {
    if (google) {
      let icon;

      const location = {
        lat: poi.coordinates.lat,
        lng: poi.coordinates.lng
      };

      if (poi.icon) {
        if (poi.icon === 'place') {
          icon = null;
        } else {
          icon = `/assets/icons/${poi.icon}`;
        }
      }

      this.poiMarker = new google.maps.Marker({
        position: location,
        icon,
        map: this.map,
        animation: google.maps.Animation.DROP
      });

      this.setPoiInfoWindow(this.poiMarker, poi);

      this.poiMarker.setMap(this.map);
      this.poiMarkerData = location;
    }
  }

  public setPoiInfoWindow(marker, poi): void {
    if (google) {
      const header = `<div style="font-weight: bold; text-align: center;border-bottom: 1px solid #bec8cc;padding-bottom: 7px;">${poi.name}</div>`;

      const content =
        `<div>${header}<div style=" margin-bottom: 0; white-space: nowrap;" >` +
        `<h5>${this.DESCRIPTION}: ` +
        `<span style="font-weight: 400;">${poi.description}<span>` +
        `</h5>` +
        `</div>`;

      const infoWindow = new google.maps.InfoWindow({
        content
      });

      marker.addListener('click', () =>
        this.openInfoMarkerWithAutoCloser(infoWindow, marker, 10000)
      );

      this.poisMarkers.push(marker);
    }
  }

  public clearPoiMarkers(): void {
    if (this.poisMarkers.length > 0) {
      this.poisMarkers.forEach((marker: any) => {
        marker.setMap(null);
        this.poisMarkers = [];
      });
    }
  }

  public setPoiMarkerClickEvent(listenerToogle, customIcon?: string): void {
    if (google) {
      if (listenerToogle === true) {
        this.poiMarkerClickEvent = this.map.addListener('click', event => {
          const myLatLng = event.latLng;
          const location = {
            coordinates: {
              lat: myLatLng.lat(),
              lng: myLatLng.lng()
            },
            icon: customIcon
          };
          this.clearPoiMarkers();
          this.setPoiMarker(location);
        });
      } else {
        google.maps.event.removeListener(this.poiMarkerClickEvent);
      }
    }
  }

  // #endregion

  // #region [DEVICE TRACE]

  public setDeviceTrace(devicesList): void {
    if (google) {
      const letDevicesPosition = [];
      const bounds = new google.maps.LatLngBounds();
      const lastElementIndex = devicesList.length - 1;

      let deviceLatLng = {
        lat: 0,
        lng: 0
      };

      devicesList.forEach((device: any) => {
        const index = devicesList.indexOf(device, 0);
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
        editable: true,
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [
          {
            icon: lineSymbol,
            pointPosition: letDevicesPosition
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
  }

  public setTraceMarkerInfoWindow(device, marker): void {
    if (google) {
      const header = `<div class="map-info-window-header" style="font-weight: bold; text-align: center;">${device.deviceType} : ${device.deviceId}</div>`;

      const content =
        `<div style='padding: 16px'>${header}<div style=" margin-bottom: 0; white-space: nowrap;" class="map-info-window-content-item" >` +
        `<h5>Registro: ` +
        `<span style="font-weight: 400;">${moment(
          device.eventDateTime.toString()
        ).format('DD/MM/YYYY HH:mm')}<span>` +
        `</h5>` +
        `</div>` +
        `<div style=" margin-bottom: 0; white-space: nowrap;" class="map-info-window-content-item" >` +
        `<h5>Latitude: ` +
        `<span style="font-weight: 400;">${device.latitude}<span>` +
        `</h5>` +
        `</div>` +
        `<div style="white-space: nowrap;" class="map-info-window-content-item" >` +
        `<h5>Longitude: ` +
        `<span style="font-weight: 400;">${device.longitude}<span>` +
        `</h5>` +
        `</div>` +
        `<div style="white-space: nowrap;" class="map-info-window-content-item" >` +
        `<h5>Placa: ` +
        `<span style="font-weight: 400;">${device.licensePlate}<span>` +
        `</h5>` +
        `</div>` +
        `<div style="white-space: nowrap;" class="map-info-window-content-item" >` +
        `<h5>Linha: ` +
        `<span style="font-weight: 400;">${device.line}<span>` +
        `</h5>` +
        `</div>` +
        `</div>`;

      const x = `
        <div style="padding: ">
          ${header}
          <div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content
      });

      marker.addListener('click', () =>
        this.openInfoMarkerWithAutoCloser(infoWindow, marker, 10000)
      );

      this.traceMarkers.push(marker);
    }
  }

  public setTraceMarker(): void {
    this.traceMarkers.forEach((marker: any) => {
      marker.setMap(this.map);
    });
  }

  public clearTraceMarker(): void {
    this.traceMarkers.forEach((marker: any) => {
      marker.setMap(null);
    });
    this.traceMarkers = [];
  }

  // #endregion

  // #region [PERIMETERS]

  public setPerimetersToMap(): void {
    this.perimetersArray.forEach(perimeter => {
      perimeter.setMap(this.map);
    });
  }

  public clearPerimetersFromMap(): void {
    this.perimetersArray.forEach(perimeter => {
      perimeter.setMap(null);
    });
  }

  private addPerimeterToArray(perimeter: Perimeter) {
    if (perimeter && google) {
      const perimeterArea = new google.maps.Polygon({
        paths: perimeter.coordinates,
        strokeColor: OFFICIAL_PERIMETER_COLOR,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillOpacity: 0,
        clickable: false
      });

      this.perimetersArray.push(perimeterArea);
    }
  }

  private onPerimetersChangeHandler(retryTimes = 0) {
    try {
      if (retryTimes >= 50) {
        return;
      }

      if (!google) {
        setTimeout(() => this.onPerimetersChangeHandler(++retryTimes), 200);
      } else {
        const perimeters$ = this.perimetersService.perimeters$.subscribe(
          perimeters => {
            this.clearPerimetersFromMap();
            this.perimetersArray = [];

            perimeters.forEach(perimeter => {
              this.addPerimeterToArray(perimeter);
            });

            if (this.shouldDisplayPerimeters) {
              this.setPerimetersToMap();
            }
          }
        );

        this.subscriptions.push(perimeters$);
      }
    } catch (e) {
      setTimeout(() => this.onPerimetersChangeHandler(++retryTimes), 200);
    }
  }

  // #endregion

  // #region [PRIVATE]

  private animateCircle(line) {
    let count = 0;
    window.setInterval(() => {
      count++;

      const icons = line.get('icons');
      icons[0].offset = `${count}px`;
      line.set('icons', icons);
    }, 1);
  }

  /**
   *
   * @param infoWindow referencia para infoWindow
   * @param marker Refencia para o marker que será adicionado o infoWindow
   * @param autoCloseTimeout tempo em ms para fechar a janela automaticamente
   */
  private openInfoMarkerWithAutoCloser(
    infoWindow,
    marker,
    autoCloseTimeout: number
  ) {
    infoWindow.open(this.map, marker);
    // setTimeout(() => {
    //   infoWindow.close();
    // }, autoCloseTimeout);
  }

  private setMarkersCluster() {
    this.markers.forEach((marker: any) => {
      this.oms.addMarker(marker);
    });

    const mcOptions = {
      maxZoom: 18,
      minimumClusterSize: 2,
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      zoomOnClick: true
    };

    this.cluster = new MarkerClusterer(this.map, this.markers, mcOptions);
  }

  private setupMapAndOms() {
    const mapElement: any = document.getElementById('map');
    mapElement.angularComponent = {
      callBack: map => {
        this.map = map;
        this.oms = new OverlappingMarkerSpiderfier(this.map);
      },
      scope: this
    };
  }

  private setupTranslations() {
    this.translate.get(['MAP', 'MAIN']).subscribe(resources => {
      const {
        MAP: {
          DESCRIPTION,
          FENCES_CATEGORY,
          SEE_TRACK,
          REPORTED_DEVICE,
          LAST_LOCATION
        },
        MAIN: { LOADING }
      } = resources;

      this.LOADING_TEXT = LOADING;
      this.DESCRIPTION = DESCRIPTION;
      this.FENCES_CATEGORY = FENCES_CATEGORY;
      this.SEE_TRACK = SEE_TRACK;
      this.REPORTED_DEVICE = REPORTED_DEVICE;
      this.LAST_LOCATION = LAST_LOCATION;
    });
  }

  private setMarkerInfoWindow(
    thing: ExtendedThing,
    marker: google.maps.Marker
  ) {
    if (google) {
      const userInfoWindowFactory = this.infoWindowFactory.createInfoWindow(
        InfoWindowTypes.userDetails
      ) as UserDetailsInfoWindow;

      userInfoWindowFactory.lastLocation = this.LAST_LOCATION;
      userInfoWindowFactory.reportedDevice = this.REPORTED_DEVICE;
      userInfoWindowFactory.seeTrackText = this.SEE_TRACK;

      const infoWindow =
        userInfoWindowFactory.createUserDetailsInfoWindow(thing);

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

      this.markers.push(marker);
    }
  }

  private setFencesDetailsMarkers(geofence: Geofence): void {
    const { coordinates, name: title } = geofence;
    const { lat, lng } = coordinates[0];

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: `/assets/icons/infoMarker.svg`,
      title
    });

    const fencesDetails = this.infoWindowFactory.createInfoWindow(
      InfoWindowTypes.fenceDetails
    ) as FencesDetailsInfoWindow;

    fencesDetails.CATEGORY = this.FENCES_CATEGORY;

    const infoWindow = fencesDetails.createMarker(geofence);
    marker.addListener('click', () => infoWindow.open(marker.getMap(), marker));
    marker.addListener('click', () => this.highlightPolygon(geofence, true));
    infoWindow.addListener('closeclick', () =>
      this.highlightPolygon(geofence, false)
    );
    this.geofenceInfoMarkers.push(marker);
  }

  // #endregion
}
