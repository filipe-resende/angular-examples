import {
  TransportsPaginatedList,
  TransportTrip,
  TransportsPeopleCounters,
  TransportFilters,
} from './transports.state';
import { TripThing } from '../../shared/models/trip-thing';
import { Trip } from '../../shared/models/trip';
import { Telemetry } from '../../shared/models/telemetry';

export class UpdateTransportsPeopleCounters {
  public static readonly type = '[TRANSPORTS] UpdateTransportsPeopleCounters';

  constructor(public partialCounters: Partial<TransportsPeopleCounters>) {}
}

export class UpdateTransportsLines {
  public static readonly type = '[TRANSPORTS] UpdateTransportsLines';

  constructor(public transportsPaginatedList: TransportsPaginatedList) {}
}

export class UpdateSelectedTrip {
  public static readonly type = '[TRANSPORTS] UpdateSelectedTrip';

  constructor(public selectedTrip: TransportTrip) {}
}

export class UpdateTripThings {
  public static readonly type = '[TRANSPORTS] UpdateTripThings';

  constructor(public tripThings: TripThing[]) {}
}

export class UpdateIsFetchingTripThingsList {
  public static readonly type = '[TRANSPORTS] UpdateIsFetchingTripThingsList';

  constructor(public isFetchingTripThingsList: boolean) {}
}

export class ClearTransportsStore {
  public static readonly type = '[TRANSPORTS] ClearTransportsStore';
}

export class UpdateTransportFilter {
  public static readonly type = '[TRANSPORTS] UpdateTransportFilter';

  constructor(public transportPeopleFilters: TransportFilters) {}
}
export class UpdateTelemetryCompanies {
  public static readonly type = '[TRANSPORTS] UpdateTelemetryCompanies';

  constructor(public telemetryCompanies: Telemetry[]) {}
}
