import { Injectable, Input, Directive } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Middlewares } from '../../../core/constants/middleware.const';

import { Geofence } from '../../../shared/models/geofence';
import { ExtendedThing } from '../../../shared/models/thing';
import { GeofencesService } from '../../../stores/geofences/geofences.service';

// eslint-disable-next-line no-shadow
export enum InfoWindowTypes {
  fenceDetails = 'fence details',
  userDetails = 'user details'
}

@Directive()
export class FencesDetailsInfoWindow {
  @Input() CATEGORY: string;

  fencesNames: any;

  constructor(
    private geoFencesService: GeofencesService,
    private translate: TranslateService
  ) {
    this.setupTranslations();
  }

  public createMarker(geofence: Geofence): google.maps.InfoWindow {
    return this.drawInfoWindowHTML(geofence);
  }

  private drawInfoWindowHTML(geofence: Geofence): google.maps.InfoWindow {
    const content = this.setupInfoWindowContent(
      geofence.name,
      geofence.categoryName
    );
    return new google.maps.InfoWindow({ content });
  }

  private setupInfoWindowContent(title: string, name?: string | null): string {
    return `
        <div class="fences-details" >
          <div class="fences-details__header">
            <div>${title || ''}</div>
          </div>
          <div class="fences-details__divisor" ></div>
          <div class="fences-details__content">
            <div>Categoria: ${this.fencesNames[name] || ''}</div>
          </div>
        </div>`;
  }

  public setupTranslations(): void {
    this.translate.get(['FENCES']).subscribe(resources => {
      const {
        FENCES: { VIRTUAL_FENCE, RADIUS_FENCE }
      } = resources;

      this.fencesNames = { VIRTUAL_FENCE, RADIUS_FENCE };
    });
  }
}

export class UserDetailsInfoWindow {
  seeTrackText: string;

  reportedDevice: string;

  device: string;

  lastLocation: string;

  licensePlate: string;

  lineName: string;

  locationType: string;

  isBusTrip: boolean;

  camera: string;

  reader: string;

  networkType: string;

  constructor(private translate: TranslateService) {}

  public createUserDetailsInfoWindow(
    thing: ExtendedThing
  ): google.maps.InfoWindow {
    this.setupTranslations();
    return this.setMarkerInfoWindow(thing);
  }

  private setMarkerInfoWindow(thing: ExtendedThing): google.maps.InfoWindow {
    const header = this.setupHeader(thing);
    const content = this.setupContent(thing, header);

    return new google.maps.InfoWindow({ content });
  }

  private setupTranslations() {
    this.translate.get(['MAP']).subscribe(resources => {
      const {
        MAP: {
          SEE_TRACK,
          DEVICE,
          REPORTED_DEVICE,
          LAST_LOCATION,
          LICENSE_PLATE,
          LINE_NAME,
          LOCATION_TYPE,
          CAMERA,
          READER,
          NETWORK_TYPE
        }
      } = resources;

      this.seeTrackText = SEE_TRACK;
      this.device = DEVICE;
      this.camera = CAMERA;
      this.reportedDevice = REPORTED_DEVICE;
      this.lastLocation = LAST_LOCATION;
      this.licensePlate = LICENSE_PLATE;
      this.lineName = LINE_NAME;
      this.locationType = LOCATION_TYPE;
      this.camera = CAMERA;
      this.reader = READER;
      this.networkType = NETWORK_TYPE;
    });
  }

  private setupContent(thing: ExtendedThing, header: string): string {
    const {
      middleware,
      busTripCompanyName,
      deviceId,
      licensePlate,
      line,
      cameraName,
      eventDateTime,
      alertMessageToDisplayOnInfoWindow,
      networkType
    } = thing;
    this.isBusTrip = !!licensePlate || !!line;
    const locationTypeDescription = this.isBusTrip
      ? `${busTripCompanyName} - ${deviceId}`
      : `${middleware} - ${deviceId}`;
    const busEventsLicensePlateAndLineInformations = this.isBusTrip
      ? ` <div class="map-info-window-content-item">
    ${this.licensePlate}:
  <span>
    ${`${licensePlate}`}
  </span>
    </div>
  <div class="map-info-window-content-item">
    ${this.lineName}:
  <span>
    ${`${line}`}
  </span>
</div>`
      : '';
    return `
    <div style="padding: 16px">
      ${header}
      <div class="map-info-window-content-item">
          ${this.locationType}:
          ${
            middleware === Middlewares.FacialRecognitionAdapter
              ? middleware
              : locationTypeDescription
          } 
      </div>
      ${
        middleware === Middlewares.FacialRecognitionAdapter
          ? `
        <div class="map-info-window-content-item">
          ${this.camera}:
            <span>
              ${cameraName.slice(0, 35)}...
            </span>
        </div> `
          : ''
      } ${
      middleware.replace(/\s/g, ' ') === Middlewares.SecurityCenter ||
      middleware === Middlewares.PortableBadgeReader
        ? `
        <div class="map-info-window-content-item">
         ${this.reader}:
            <span>
              ${cameraName.slice(0, 35)}...
            </span>
        </div> `
        : ''
    }
    ${
      middleware === Middlewares.SmartBadge
        ? `
        <div class="map-info-window-content-item">
         ${this.networkType}:
            <span>
              ${networkType}
            </span>
        </div> `
        : ''
    }
      <div class="map-info-window-content-item">
          ${this.lastLocation}:
          <span>
          ${moment(eventDateTime.toString()).format('DD/MM/YYYY HH:mm')}
          </span>
      </div>
      ${busEventsLicensePlateAndLineInformations}
      ${
        alertMessageToDisplayOnInfoWindow
          ? `
            <div class="map-info-window-alert">
              <div class="material-icons" style="color: white; font-size: 12px; height: 12px;">
                info
              </div>
              ${alertMessageToDisplayOnInfoWindow}
            </div>
          `
          : ''
      }
    </div>
    <div
      id="infoWindowButton"
      class="map-info-window-button"
      role="option"
      aria-disabled="false"
    >
      ${this.seeTrackText}
    </div>
  `;
  }

  private setupHeader(thing: ExtendedThing): string {
    const { name, batteryState } = thing;
    const batteryPercent = thing.batteryPercent || '';
    const batteryIcon = this.setBatteryIcon(batteryState);

    return `
    <div class="map-info-window-header" style="justify-content:space-between">
      <span>
        ${name}
      </span>
      ${batteryState ? this.setupHeaderInfo(batteryPercent, batteryIcon) : ''}
    </div>`;
  }

  private setBatteryIcon(batteryState: string): string {
    if (batteryState === 'LOW')
      return `<img class="image-battery-map battery__image" src="assets/icons/Battery_Low.png">`;

    if (batteryState === 'MEDIUM')
      return `<img class="image-battery-map battery__image" src="assets/icons/Battery_Medium.svg">`;

    if (batteryState === 'GOOD')
      return `
          <mat-icon
            class="mat-icon material-icons"
            role="img"
            aria-hidden="true"
            style="font-size: 18px; height: 18px; width: 18px; color:#69be28"
          >
            battery_full
          </mat-icon>
        `;

    return '';
  }

  private setupHeaderInfo(percent: string, icon: string): string {
    return percent
      ? `<div class="header__battery"><span>${
          percent ? `${percent}%` : ''
        }</span>${icon}</div>`
      : `<div class="header__battery"></span>${icon}</div>`;
  }
}

@Injectable()
export class InfoWindowFactory {
  constructor(
    private geoFencesService: GeofencesService,
    private translateService: TranslateService
  ) {}

  public createInfoWindow(
    type: InfoWindowTypes
  ): FencesDetailsInfoWindow | UserDetailsInfoWindow {
    switch (type) {
      case InfoWindowTypes.fenceDetails:
        return new FencesDetailsInfoWindow(
          this.geoFencesService,
          this.translateService
        );
      case InfoWindowTypes.userDetails:
        return new UserDetailsInfoWindow(this.translateService);
      default:
        return null;
    }
  }
}
