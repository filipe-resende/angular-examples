import { AssociationDesassociationScreenEnum } from '../shared/enums/associationDesassociationScreen';
import { DeviceAssociationThing, DeviceItem } from './devices-interfaces';

export interface DeviceThingAssociation {
  device: DeviceItem;
  associatedThings: [DeviceAssociationThing];
  screen: AssociationDesassociationScreenEnum;
  applicationName: string;
}
