/* eslint-disable no-unused-expressions */

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThingItem } from 'src/app/model/things-interfaces';
import { ThingLocationService } from 'src/app/services/location-api/thing-location.service';
import { ThingsService } from 'src/app/services/factories/things.service';
import { FixMeLater } from 'src/app/shared/types/shared-types';
import { BatteryState } from 'src/app/shared/enums/batteryState';

@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss'],
})
export class InfoCardsComponent implements OnInit {
  @Input() deviceData;

  @Input() thingData;

  public FACIAL_RECOGNITION_APPLICATION_ID =
    '1101e2fb-05a4-459c-9b5e-86a43171059b';

  public thingName: string;

  public thingNameAssociated: string;

  public batteryState: string;

  public coordinates = [];

  public status: boolean;

  public noLocationData: boolean;

  public isFacialRecognition: boolean;

  public thingId: string;

  public applicationId: string;

  public deviceId: string;

  public thingEventDateTime: string;

  public deviceEventDateTime: string;

  public thingLocationData$: Observable<FixMeLater>;

  public isDevice: boolean;

  public deviceSourceValue: string;

  public thigNameAssociatedId: string;

  public thingEventLatitude: string;

  public thingEventLongitude: string;

  public thingEventDevicesInfo: string;

  public thingEventBatteryState: BatteryState;

  public thingEventBatteryPercent: string;

  public get thingBatteryState(): typeof BatteryState {
    return BatteryState;
  }

  constructor(
    private thingLocationService: ThingLocationService,
    private thingsService: ThingsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.deviceData !== undefined) {
      this.deviceData.associatedThings.length
        ? this.getDeviceDetails(this.deviceData)
        : this.displayNoLocation();
      this.thingData = undefined;
    } else if (this.thingData !== undefined) {
      this.deviceData = undefined;
      this.getThingDetails(this.thingData);
    }
  }

  // DEVICE UPDATE VIEW
  // -------------------- //

  getDeviceDetails(tmDeviceData) {
    this.thingLocationData$ = this.thingLocationService.lastById(
      tmDeviceData.associatedThings[0].thing.id,
    );
    this.thingLocationData$.subscribe(
      (response: ThingItem) => {
        this.thingNameAssociated = response.name;
        this.thigNameAssociatedId = response.id;

        if (tmDeviceData.associatedThings[0].thing.name === response.name) {
          this.setDeviceDetails(response, tmDeviceData);
          this.noLocationData = false;
        }
      },
      error => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.displayNoLocation();
      },
    );
  }

  setDeviceDetails(locationDeviceData, tmDeviceData) {
    const device = locationDeviceData.associatedDevices.find(
      el => el.id === tmDeviceData.device.id,
    );
    this.coordinates = [
      ...device.lastLocations[0].position.geographic.coordinates,
    ];
    this.batteryState = device.lastLocations[0].operationalInfo.batteryState;
    this.thingName = locationDeviceData.name;
    this.deviceEventDateTime = device.lastLocations[0].eventDateTime;
    this.thingId = locationDeviceData.id;
  }

  redirectToThing(): void {
    const { id } = this.deviceData.associatedThings[0].thing;
    this.router.navigate([`things/update/${id}`]);
  }

  getThingDetails(tmThingData) {
    this.thingLocationData$ = this.thingsService.lastLocationByThingId(
      tmThingData.id,
    );

    this.thingLocationData$.subscribe(
      (response: FixMeLater) => {
        if (response?.deviceId) {
          const lastLocationEvent = response;
          this.setThingDetails(lastLocationEvent);
        } else {
          this.displayNoLocation();
        }
      },
      error => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.displayNoLocation();
      },
    );
  }

  setThingDetails(locationThingData) {
    this.isFacialRecognition =
      locationThingData.applicationId ===
      this.FACIAL_RECOGNITION_APPLICATION_ID;
    this.thingEventDateTime = locationThingData.eventDateTime;
    this.thingEventLatitude = this.removeCharacter(locationThingData.latitude);
    this.thingEventLongitude = this.removeCharacter(
      locationThingData.longitude,
    );
    this.thingEventDevicesInfo = locationThingData.middleware;

    if (locationThingData.deviceId && !this.isFacialRecognition) {
      this.thingEventDevicesInfo += `:   ${locationThingData.deviceId}`;
    }
    this.thingEventBatteryState = locationThingData.batteryState;
    this.thingEventBatteryPercent = locationThingData.batteryPercent;
    this.deviceSourceValue = locationThingData.deviceId;
    this.applicationId = locationThingData.applicationId;
  }

  removeCharacter(coordinates) {
    const regex = /-?\d+(\.\d{1,4})/;

    if (regex.test(coordinates)) {
      return regex.exec(coordinates)[0];
    }

    return 'N/A';
  }

  redirectToDevice(applicationId: string, deviceIdentificator: string): void {
    this.router.navigate([
      'devices',
      {
        applicationId,
        deviceIdentificator,
      },
    ]);
  }

  displayNoLocation() {
    this.noLocationData = true;
  }
}
