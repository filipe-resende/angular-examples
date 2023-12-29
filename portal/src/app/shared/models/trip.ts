import { Coordinates } from './coordinates';

export interface Trip {
  code: string;
  line: string;
  telemetry?: string;
  telemetryApplicationId?: string;
  displayName: string;
  lastLocation?: Coordinates;
  eventDateTime?: string;
  direction?: string;
  category?: string;
  busPlate?: string;
  peopleInLineCount?: number;
  startTripTime?: Date;
  finalDateTrip?: Date;
  initialPointLocation?: Coordinates;
}
