import { ValeLocations } from './valeLocations';

export interface DeviceLocation {
  eventDateTime: string;
  deviceType: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  deviceName: string;
  batteryState: string;
  batteryPercent?: string;
  isMoving?: boolean;
  networkType?: string;
  middleware?: string;
  sourceApplicationId?: string;
  deviceGroupName?: string;
  line?: string;
  licensePlate?: string;
  cameraName?: string;
  eventDirection?: string;
  eventType?: string;
  index?: number;
  readerName?: string;
  areaName?: string;
  deviceCategoryName?: string;
  valeLocations?: ValeLocations[];
  telemetryName?: string;
}
