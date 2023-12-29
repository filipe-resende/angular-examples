/* eslint-disable no-unused-expressions */

import { Component, OnInit, Input } from '@angular/core';
import { ThingLocationService } from 'src/app/services/location-api/thing-location.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  BatteryState,
  getBatteryState,
} from 'src/app/shared/enums/batteryState';
import { FixMeLater } from 'src/app/shared/types/shared-types';
import { DeviceAssociation } from 'src/app/model/devices-interfaces';
import { ThingItem } from 'src/app/model/things-interfaces';
import { DeviceLocationInfo } from 'src/app/services/location-api/device-location.service';

@Component({
  selector: 'app-device-battery',
  templateUrl: './device-battery.component.html',
  styleUrls: ['./device-battery.component.scss'],
})
export class DeviceBatteryComponent implements OnInit {
  @Input() deviceData: DeviceAssociation;

  @Input() thingData: ThingItem;

  public thingName: string;

  public thingNameAssociated: string;

  public deviceBatteryState: BatteryState;

  public deviceBatteryPercent: number;

  public coordinates = [];

  public status: boolean;

  public noLocationData: boolean;

  public thingId: string;

  public applicationId: string;

  public deviceId: string;

  public eventDateTime: string;

  public deviceEventDateTime: string;

  public thingLocationData$: Observable<FixMeLater>;

  public isDevice: boolean;

  public deviceSourceValue: FixMeLater;

  public thigNameAssociatedId: string;

  public displayLastLocation: boolean;

  public get batteryState(): typeof BatteryState {
    return BatteryState;
  }

  constructor(
    private thingLocationService: ThingLocationService,
    private deviceLocationService: DeviceLocationInfo,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.deviceData !== undefined) {
      this.deviceData.device
        ? this.getDeviceDetails(this.deviceData)
        : this.displayNoLocation();
      this.thingData = null;
    } else if (this.thingData !== undefined || this.thingData !== null) {
      this.deviceData = null;
      this.getThingDetails(this.thingData);
    }
  }

  getDeviceDetails(tmDeviceData: DeviceAssociation): void {
    this.thingLocationData$ = this.deviceLocationService.getSourceApplicationsById(
      tmDeviceData.device.applicationId,
      tmDeviceData.device.id,
    );

    this.thingLocationData$.subscribe(
      (response: FixMeLater) => {
        const deviceInfo = response?.at()?.deviceInfo;

        if (deviceInfo && tmDeviceData.device.id === deviceInfo.id) {
          this.applicationId = response.at().sourceApplicationId;
          this.deviceId = deviceInfo.id;

          this.setDeviceDetails(response.at(), tmDeviceData.device);
          this.noLocationData = false;
        } else {
          this.displayNoLocation();
        }
      },
      error => {
        console.error(error);
        this.displayNoLocation();
      },
    );
  }

  setDeviceDetails(locationDeviceData, tmDeviceData): void {
    const device = locationDeviceData;
    this.displayLastLocation = device != null;

    this.coordinates = [...device.position.geographic.coordinates];
    this.deviceBatteryPercent = Number.isNaN(
      device.operationalInfo.batteryState,
    )
      ? -1
      : device.operationalInfo.batteryState;
    this.deviceBatteryState = getBatteryState(
      device.operationalInfo.batteryState,
    );
    this.deviceEventDateTime = device.eventDateTime;
  }

  redirectToThing(): void {
    const { id } = this.deviceData.associatedThings[0].thing;
    this.router.navigate([`things/update/${id}`]);
  }

  getThingDetails(tmThingData: ThingItem): void {
    this.thingLocationData$ = this.thingLocationService.lastById(
      tmThingData.id,
    );
    this.thingLocationData$.subscribe(
      response => {
        if (response.associatedDevices.length) {
          const eventDateTimeList = response.associatedDevices
            .map(element => element.lastLocations[0].eventDateTime)
            .sort();
          const lastEvent = eventDateTimeList[eventDateTimeList.length - 1];
          const lastLocationEvent = response.associatedDevices.find(
            element => element.lastLocations[0].eventDateTime === lastEvent,
          );
          this.setThingDetails(lastLocationEvent);
        }
      },
      error => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.displayNoLocation();
      },
    );
  }

  setThingDetails(locationThingData): void {
    this.eventDateTime = locationThingData.lastLocations[0].eventDateTime;
    this.coordinates = [
      ...locationThingData.lastLocations[0].position.geographic.coordinates,
    ];
    this.applicationId = locationThingData.applicationId;
    this.deviceId = locationThingData.id;
    this.deviceSourceValue = locationThingData.sourceInfos[0].value;
  }

  redirectToDevice(applicationId, deviceId): void {
    this.router.navigate([`devices/update/${applicationId}/${deviceId}`], {
      queryParams: this.deviceData,
    });
  }
  // ------------------------ //

  displayNoLocation(): void {
    this.noLocationData = true;
  }
}
