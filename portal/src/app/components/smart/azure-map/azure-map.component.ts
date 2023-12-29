import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import * as atlas from 'azure-maps-control';

import { OFFICIAL_PERIMETER_COLOR } from '../../../shared/enums/valeColors';
import { Geofence } from '../../../shared/models/geofence';
import GeofenceCategory from '../../../shared/models/geofence-category';
import { Perimeter } from '../../../shared/models/perimeter';
import { environment } from '../../../../environments/environment';
import { Middlewares } from '../../../core/constants/middleware.const';
import {
  isAuthorizedEntrance,
  isAuthorizedExit,
  isBusIntegrationEvent,
  isDeniedEntrance,
  isDeniedExit,
  isExitingEvent,
  isSecurityCenterEvent
} from '../../../shared/utils/location-events-helpers/location-events-helpers';
import { Thing } from '../../../shared/models/thing';

@Component({
  selector: 'app-azure-map',
  templateUrl: './azure-map.component.html',
  styleUrls: ['./azure-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AzureMapComponent implements AfterViewInit {
  @Input()
  public name: string;

  @Input()
  public showControls = true;

  @Output() public showDeviceTrace = new EventEmitter();

  @Output() public showEventGeofence = new EventEmitter();

  @ViewChild('map', { static: true })
  public mapContainer: any;

  public map: atlas.Map;

  public shouldDisplayPerimeters = true;

  public perimeter: Perimeter[];

  public perimetersLayer = [];

  private perimetersOptions = [];

  public geofencesLayer = [];

  private geofencesOptions = [];

  private geofencesMarkers = [];

  ngAfterViewInit(): void {
    this.setMap();
  }

  public onTogglePerimetersClick(checkboxEvent: MatCheckboxChange): void {
    this.map.events.add('ready', () => {
      for (let i = 0; i < this.perimetersOptions.length; i++) {
        this.perimetersOptions[i].visible = checkboxEvent.checked;
        this.perimetersLayer[i].setOptions(this.perimetersOptions[i]);
      }
    });
  }

  public onToggleGeofenceClick(checkboxEvent: boolean, id?: string): void {
    this.map.events.add('ready', () => {
      for (let i = 0; i < this.geofencesOptions.length; i++) {
        if (this.geofencesLayer[i].id === id && id) {
          this.geofencesOptions[i].visible = checkboxEvent;
          this.geofencesLayer[i].setOptions(this.geofencesOptions[i]);

          if (checkboxEvent) {
            this.map.markers.add(this.geofencesMarkers[i]);
          } else {
            this.map.markers.remove(this.geofencesMarkers[i]);
          }
        }
      }
    });
  }

  public setMap(options?: any) {
    if (options) {
      this.map = new atlas.Map(this.mapContainer.nativeElement, {
        center: [options.center.lng, options.center.lat],
        zoom: options.zoom,
        language: 'pt-BR',
        view: 'auto',
        style: 'satellite',
        showLogo: false,
        autoResize: true,
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: environment.azureSubscriptionKey
        }
      });

      this.map.events.add('ready', () => {
        const currentControls = this.map.controls.getControls();
        this.map.controls.remove(currentControls);
        this.map.controls.add(new atlas.control.ZoomControl(), {
          style: atlas.ControlStyle.auto,
          position: atlas.ControlPosition.BottomRight
        });
      });
    }
  }

  public mapStyleChanged(optionStyleMap: any): void {
    this.map.setStyle({
      style: optionStyleMap
    });
  }

  public resizeMap(): void {
    this.map.resize();
  }

  public setMapOn(lat: number, lng: number, zoom = 16): void {
    this.map.events.add('ready', () => {
      this.map.setCamera({
        center: [lng, lat],
        zoom
      });
    });
  }

  public setPerimetersOnMap(perimeters: Perimeter[]): void {
    this.perimeter = perimeters;
    this.mapPolygonToDrawing(perimeters, false);
  }

  public setGeofencesOnMap(
    geofences: Geofence[],
    geofenceCategories?: GeofenceCategory[]
  ): void {
    this.mapPolygonToDrawing(geofences, true);
  }

  private mapPolygonToDrawing(perimeters: any, addLayerMarker: boolean) {
    perimeters.forEach(polygon => {
      const polygonPositions = [];
      polygon.coordinates[0].forEach(coord => {
        polygonPositions.push(
          this.mapCoordinatesToPosition(coord.lng, coord.lat)
        );
      });
      this.drawPolygon(polygonPositions, polygon.perimeterId);

      if (addLayerMarker) {
        this.addLayersGeofencesMarkers(polygonPositions[0], polygon);
      }
    });
  }

  private mapCoordinatesToPosition(
    lng: number,
    lat: number
  ): atlas.data.Position {
    return new atlas.data.Position(lng, lat);
  }

  private drawPolygon(polygonPositions, id: string, color?: string) {
    this.map.events.add('ready', () => {
      const dataSource = new atlas.source.DataSource();
      this.map.sources.add(dataSource);
      dataSource.add(
        new atlas.data.Feature(new atlas.data.Polygon([polygonPositions]))
      );

      const lineLayer = new atlas.layer.LineLayer(dataSource, id, {
        strokeColor: color || OFFICIAL_PERIMETER_COLOR,
        strokeWidth: 3
      });

      if (!color) {
        this.perimetersLayer.push(lineLayer);
        this.perimetersOptions.push(lineLayer.getOptions());
      } else {
        this.geofencesLayer.push(lineLayer);
        this.geofencesOptions.push(lineLayer.getOptions());
      }

      this.map.layers.add(lineLayer, 'labels');
    });
  }

  public addLayersGeofencesMarkers(positions: any, geofence: Geofence): void {
    const svg = `/assets/icons/infoMarker.svg`;

    this.map.events.add('ready', () => {
      const marker = new atlas.HtmlMarker({
        htmlContent: `<img width="35" height="35" src=${svg}>`,
        position: [positions[0], positions[1]],
        popup: new atlas.Popup({
          content: `
          <div class="fences-details" >
            <div class="fences-details__header">
              <div>${geofence.name || ''}</div>
            </div>
            <div class="fences-details__divisor" ></div>
            <div class="fences-details__content">
              <div>Categoria: ${geofence.description || ''}</div>
            </div>
          </div>`,
          pixelOffset: [0, -30]
        })
      });

      this.geofencesMarkers.push(marker);
      this.map.events.add('click', marker, () => {
        marker.togglePopup();
      });
    });
  }

  public setGeofencesVisibilityTo(visibility: boolean): void {
    this.map.events.add('ready', () => {
      for (let i = 0; i < this.geofencesOptions.length; i++) {
        this.geofencesOptions[i].visible = visibility;
        this.geofencesLayer[i].setOptions(this.geofencesOptions[i]);

        if (visibility) {
          this.map.markers.add(this.geofencesMarkers[i]);
        } else {
          this.map.markers.remove(this.geofencesMarkers[i]);
        }
      }
    });
  }

  public createThingsPositionswithClusters(markers: any, showPopup: boolean) {
    this.map.events.add('ready', () => {
      const datasource = new atlas.source.DataSource(null, {
        cluster: true,
        clusterRadius: 45,
        clusterMaxZoom: 18
      });

      this.map.sources.add(datasource);

      markers.forEach((thing: Thing) => {
        let entityType = thing.middleware?.split(' ')?.join('');

        if (isBusIntegrationEvent(thing?.eventType)) {
          if (isExitingEvent(thing?.eventDirection)) {
            entityType = Middlewares.BusTripTrackerExitingAdapter;
          } else {
            entityType = Middlewares.BusTripTrackerEntranceAdapter;
          }
        }

        if (isSecurityCenterEvent(thing.middleware)) {
          if (isDeniedEntrance(thing)) {
            entityType = 'securityCenterDeniedEntrance';
          } else if (isDeniedExit(thing)) {
            entityType = 'securityCenterDeniedExit';
          } else if (isAuthorizedEntrance(thing)) {
            entityType = 'securityCenterAuthorizedEntrance';
          } else if (isAuthorizedExit(thing)) {
            entityType = 'securityCenterAuthorizedExit';
          }
        }

        const geoJson = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [thing.longitude, thing.latitude]
          },
          properties: {
            thing,
            entityType
          }
        };
        datasource.add(geoJson);
      });

      const clusterBubbleLayer = new atlas.layer.BubbleLayer(datasource, null, {
        radius: 15,
        color: 'blue',
        strokeWidth: 0,
        filter: ['has', 'point_count']
      });

      this.map.layers.add([
        clusterBubbleLayer,
        new atlas.layer.SymbolLayer(datasource, null, {
          iconOptions: {
            image: 'none'
          },
          textOptions: {
            textField: ['get', 'point_count_abbreviated'],
            offset: [0, 0.4],
            color: 'white'
          }
        })
      ]);

      const iconPromises = this.addIconsMiddlewares();

      Promise.all(iconPromises).then(t => {
        const pointSymbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
          filter: ['!', ['has', 'point_count']],
          iconOptions: {
            image: [
              'match',

              ['get', 'entityType'],

              'SecurityCenter',
              'SecurityCenter',
              'SharingSafety',
              'SharingSafety',
              'SmartBadge',
              'SmartBadge',
              'SPOT',
              'SPOT',
              'Ônibus',
              'Ônibus',
              Middlewares.BusTripTrackerExitingAdapter,
              Middlewares.BusTripTrackerExitingAdapter,
              Middlewares.BusTripTrackerEntranceAdapter,
              Middlewares.BusTripTrackerEntranceAdapter,
              'ReconhecimentoFacial',
              'ReconhecimentoFacial',
              'securityCenterDeniedExit',
              'securityCenterDeniedExit',
              'securityCenterDeniedEntrance',
              'securityCenterDeniedEntrance',
              'securityCenterAuthorizedExit',
              'securityCenterAuthorizedExit',
              'securityCenterAuthorizedEntrance',
              'securityCenterAuthorizedEntrance',
              'PortableBadgeReader',
              'PortableBadgeReader',
              'icon-default'
            ]
          }
        });

        this.map.layers.add(pointSymbolLayer);
      });
    });
  }

  private addIconsMiddlewares() {
    return [
      this.map.imageSprite.add(
        'SecurityCenter',
        '/assets/icons/SecurityCenter.svg'
      ),
      this.map.imageSprite.add(
        'SharingSafety',
        '/assets/icons/Sharing Safety.svg'
      ),
      this.map.imageSprite.add('SmartBadge', '/assets/icons/SmartBadge.svg'),
      this.map.imageSprite.add('SPOT', '/assets/icons/SPOT.svg'),
      this.map.imageSprite.add('Ônibus', '/assets/icons/BusMiddleware.svg'),
      this.map.imageSprite.add(
        Middlewares.BusTripTrackerEntranceAdapter,
        '/assets/icons/BusEntrance.svg'
      ),
      this.map.imageSprite.add(
        Middlewares.BusTripTrackerExitingAdapter,
        '/assets/icons/BusExiting.svg'
      ),
      this.map.imageSprite.add(
        'icon-default',
        '/assets/icons/icon-default.svg'
      ),
      this.map.imageSprite.add(
        'securityCenterAuthorizedExit',
        '/assets/icons/securityCenter_authorizedExit.svg'
      ),
      this.map.imageSprite.add(
        'securityCenterAuthorizedEntrance',
        '/assets/icons/securityCenter_authorizedEntrance.svg'
      ),
      this.map.imageSprite.add(
        'securityCenterDeniedExit',
        '/assets/icons/securityCenter_deniedExit.svg'
      ),
      this.map.imageSprite.add(
        'securityCenterDeniedEntrance',
        '/assets/icons/securityCenter_deniedEntrance.svg'
      ),
      this.map.imageSprite.add(
        'ReconhecimentoFacial',
        '/assets/icons/facial-recognition.svg'
      ),
      this.map.imageSprite.add(
        'PortableBadgeReader',
        '/assets/icons/PortableBadgeReader.svg'
      )
    ];
  }
}
