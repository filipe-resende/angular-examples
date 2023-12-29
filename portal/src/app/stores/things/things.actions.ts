import { HttpErrorResponse } from '@angular/common/http';
import { ThingByName } from '../../shared/models/thingByName';
import { ThingsStateModel, ThingTrackModel } from './things.state';

export class UpdateThingsState {
  public static readonly type = '[THINGS] UpdateThingsState';

  constructor(public thingsStateModel: Partial<ThingsStateModel>) {}
}

export class UpdateThingTracking {
  public static readonly type = '[THINGS] UpdateThingTracking';

  constructor(public thingTracking: ThingTrackModel) {}
}

export class UpdateRefreshTimeInfo {
  public static readonly type = '[THINGS] UpdateRefreshTimeInfo';

  constructor(public refreshTimeInfo: Date) {}
}

export class UpdateRefreshTimeInfoHistoricPage {
  public static readonly type = '[THINGS] UpdateRefreshTimeInfoHistoricPage';

  constructor(public refreshTimeInfoHistoricPage: Date) {}
}

export class FetchThingsByName {
  public static readonly type = '[THINGS] FetchThingsByName';

  constructor(public name: string) {}
}

export class FetchThingsByNameSuccess {
  public static readonly type = '[THINGS] FetchThingsByNameSuccess';

  constructor(public thingsFilteredByNameList: ThingByName[]) {}
}
export class FetchThingsByNameFailure {
  public static readonly type = '[THINGS] FetchThingsByNameFailure';
}

export class ClearThingsStore {
  public static readonly type = '[THINGS] ClearThingsStore';
}

export class ClearFilterdThingsList {
  public static readonly type = '[THINGS] ClearFilterdThingsList';
}

export class UpdateHttpErrorResponse {
  public static readonly type = '[DEVICES] UpdateHttpErrorResponse';

  constructor(public httpErrorResponse?: HttpErrorResponse) {}
}
