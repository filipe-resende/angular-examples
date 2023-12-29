import { Coordinates } from "./coordinates";

export interface TripThing {
  tripCode: string;
  cardId: string;
  document: string;
  location: Coordinates;
  eventDateTime: Date;
  company?: string;
  type?: string;
  name?: string;
}
