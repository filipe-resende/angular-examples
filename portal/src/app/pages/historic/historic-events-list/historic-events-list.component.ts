/* eslint no-param-reassign: "warn" */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnChanges
} from '@angular/core';
import { EventTypeLabels } from '../../../core/constants/event-type';
import { Middlewares } from '../../../core/constants/middleware.const';
import { DeviceLocation } from '../../../shared/models/device';
import { cloneObject } from '../../../shared/utils/clone';
import { ValeLocations } from '../../../shared/models/valeLocations';
import {
  getSpotGroupName,
  getTypeAccess,
  isBusIntegrationEvent,
  isBusMiddleware,
  isExitingEvent,
  isFacialMiddleware,
  isPortableBadgeMiddleware,
  isSecurityCenterEvent,
  isSmartBadgeOrMaxTrackMiddleware,
  isSpotMiddleware,
  refactoryDeviceName
} from '../../../shared/utils/location-events-helpers/location-events-helpers';
import { GetGeofenceNames } from '../../../shared/utils/valeLocation-helper';

export interface ExtendedDeviceLocation extends DeviceLocation {
  isLocationSelected?: boolean;
  typeAccess?: string;
}

@Component({
  selector: 'app-historic-events-list',
  templateUrl: './historic-events-list.component.html',
  styleUrls: ['./historic-events-list.component.scss']
})
export class HistoricEventsListComponent implements OnChanges {
  @Input() devicesLocationHistory: ExtendedDeviceLocation[];

  @Output() selectedDeviceLocation = new EventEmitter<ExtendedDeviceLocation>();

  public EventTypeLabels = EventTypeLabels;

  public devicesLocations: ExtendedDeviceLocation[] = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnChanges() {
    this.setTypeAccessAndIndexToLocations();
    this.sortElementsByData();
    this.setSelectedLocation();
  }

  sortElementsByData(): ExtendedDeviceLocation[] {
    return this.devicesLocations.sort((a, b) => {
      return <any>new Date(b.eventDateTime) - <any>new Date(a.eventDateTime);
    });
  }

  setTypeAccessAndIndexToLocations(): void {
    this.devicesLocations = cloneObject(this.devicesLocationHistory);
    this.devicesLocations.forEach(location => {
      location.index = this.devicesLocations.indexOf(location, 0);
      location.middleware = location.middleware.replace(/\s/g, ' ');
      location.typeAccess = getTypeAccess(location);
    });
  }

  setSelectedLocation(deviceLocation?: DeviceLocation): void {
    if (deviceLocation) {
      this.cleanSelectedEvent();
      const selectedLocation = this.devicesLocations.find(
        d => d.index === deviceLocation.index
      );
      selectedLocation.isLocationSelected = true;
      const element = document.getElementById(
        `location-${deviceLocation.index}`
      );
      element!.scrollIntoView({ block: 'end', behavior: 'smooth' });
      this.cdRef.detectChanges();
      return;
    }

    if (this.devicesLocations.length > 0) {
      this.devicesLocations[0].isLocationSelected = true;
    }
  }

  getSpotGroupName(deviceCategoryName: string): string {
    return getSpotGroupName(deviceCategoryName);
  }

  public isBusMiddleware(middleware: string): boolean {
    return isBusMiddleware(middleware);
  }

  public isFacialMiddleware(middleware: string): boolean {
    return isFacialMiddleware(middleware);
  }

  public isReaderMiddleware(middleware: string): boolean {
    return (
      this.isSecurityCenterMiddleware(middleware) ||
      isPortableBadgeMiddleware(middleware)
    );
  }

  public isSecurityCenterMiddleware(middleware: string): boolean {
    return (
      isSecurityCenterEvent(middleware) ||
      middleware.replace(/\s/g, ' ') === Middlewares.SecurityCenter
    );
  }

  public isBusIntegrationEvent(eventType: string): boolean {
    return isBusIntegrationEvent(eventType);
  }

  public isExitingEvent(eventDirection: string): boolean {
    return isExitingEvent(eventDirection);
  }

  refactoryDeviceName(deviceType: string): string {
    return refactoryDeviceName(deviceType);
  }

  public isSpotMiddleware(middleware: string): boolean {
    return isSpotMiddleware(middleware);
  }

  public isSmartBadgeOrMaxTrackMiddleware(middleware: string): boolean {
    return isSmartBadgeOrMaxTrackMiddleware(middleware);
  }

  onSelectedEvent(event: ExtendedDeviceLocation): void {
    this.cleanSelectedEvent();
    event.isLocationSelected = !event.isLocationSelected;
    this.selectedDeviceLocation.emit(event);
  }

  cleanSelectedEvent(): void {
    const selectedEvent = this.devicesLocations.find(l => l.isLocationSelected);

    if (selectedEvent) {
      selectedEvent.isLocationSelected = false;
    }
  }

  public showValeLocations(
    valeLocations: ValeLocations[],
    isItForExport: boolean
  ): string {
    return GetGeofenceNames(valeLocations, isItForExport);
  }
}
