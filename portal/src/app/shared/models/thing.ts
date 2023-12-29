import { ValeLocations } from './valeLocations';

export interface Thing {
  id?: string;
  name?: string;
  lastLocalization?: string;
  number?: string;
  company?: string;
  nameEmployee?: string;
  document?: string;
  eventDateTime?: string;
  deviceType?: string;
  deviceId?: string;
  networkKey?: string;
  latitude?: number;
  longitude?: number;
  batteryState?: string;
  batteryPercent?: string;
  companyName?: string;
  isMoving?: boolean;
  networkType?: string;
  applicationId?: string;
  middleware?: string;
  deviceGroupName?: string;
  locationEvent?: string;
  licensePlate?: string;
  line?: string;
  busTripCompanyName?: string;
  cameraName?: string;
  virtualFence?: string;
  eventDirection?: string;
  hasAccessToSiteDenied?: boolean;
  eventType?: string;
  isPerimeterExiting?: boolean;
  typeAccess?: string;
  displayName?: string;
  valeLocations?: ValeLocations[];
  deviceCategoryName?: string;
  fences?: string;
  isMultiFence?: boolean;
}

export interface ExtendedThing extends Thing {
  isThingSelected?: boolean;
  showAlert?: boolean;
  alertMessageToDisplayOnInfoWindow?: string;
}
