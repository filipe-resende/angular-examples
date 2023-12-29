import { AssociatedDevices } from './associatedDevices';
import { SourceInfos } from './sourceInfos';

export interface ThingByName {
  id: string;
  name: string;
  associatedDevices?: AssociatedDevices[];
  sourceInfos?: SourceInfos[];
}
