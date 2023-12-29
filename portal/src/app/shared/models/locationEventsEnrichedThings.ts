import { Thing } from './thing';

export interface LocationEventsEnrichedThings {
  thingLocationEvents?: Thing[];
  latestEventDate?: Date;
  eventsCount?: number;
}
