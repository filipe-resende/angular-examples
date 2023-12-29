import { DeviceAssociationThing, DeviceItem } from './devices-interfaces';

export interface DeviceWithAssociatedThings {
  device: DeviceItem;
  associatedThings: DeviceAssociationThing;
}
