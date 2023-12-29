import { DeviceWithThing } from "../../src/app/core/repositories/devices.repository";
import { BatteryState } from "../../src/app/shared/enums/batteryState";
import { DeviceModel } from "../../src/app/stores/devices/devices.state";

export const DEVICE_WITH_THING_MOCK_1: DeviceWithThing = {
  nameThing: "nameThing 1",
  documentThing: "111",
  eventDateTime: "2020-01-01",
  deviceType: "deviceType 1",
  deviceId: "111",
  latitude: 10,
  longitude: 10,
  batteryState: "GOOD",
  deviceName: "111",
  applicationId: 'applicationId 1',
  batteryPercent: '50%'
};

export const DEVICE_WITH_THING_MOCK_2: DeviceWithThing = {
  nameThing: "nameThing 2",
  documentThing: "222",
  eventDateTime: "2020-02-02",
  deviceType: "deviceType 2",
  deviceId: "222",
  latitude: 20,
  longitude: 20,
  batteryState: "LOW",
  deviceName: "222",
  applicationId: 'applicationId 2',
  batteryPercent: '50%'
};


export const DEVICE_MODEL_MAPPED_MOCK_1: DeviceModel = {
  thingName: 'nameThing 1',
  thingDoc: '111',
  deviceType: 'deviceType 1',
  deviceId: '111',
  lastReport: new Date('2020-01-01'),
  lastLocation: {
    lat: 10,
    lng: 10,
  },
  batteryState: BatteryState.Good,
  applicationId: 'applicationId 1',
  batteryPercent: '50%'
};


export const DEVICE_MODEL_MAPPED_MOCK_2: DeviceModel = {
  thingName: 'nameThing 2',
  thingDoc: '222',
  deviceType: 'deviceType 2',
  deviceId: '222',
  lastReport: new Date('2020-02-02'),
  lastLocation: {
    lat: 20,
    lng: 20,
  },
  batteryState: BatteryState.Low,
  applicationId: 'applicationId 2',
  batteryPercent: '50%'
};

