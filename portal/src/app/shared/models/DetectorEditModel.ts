import { Detector } from './Detector';
import { Geofence } from './geofence';

export interface DetectorEditModel {
  user: string;
  geofence: Geofence;
  detectors: Detector[];
}
