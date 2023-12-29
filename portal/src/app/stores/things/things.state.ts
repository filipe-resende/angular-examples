import { Action, State, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Thing } from '../../shared/models/thing';
import {
  ClearFilterdThingsList,
  ClearThingsStore,
  FetchThingsByName,
  FetchThingsByNameSuccess,
  UpdateThingsState,
  UpdateThingTracking,
  UpdateRefreshTimeInfo,
  UpdateHttpErrorResponse
} from './things.actions';
import { DeviceLocation } from '../../shared/models/device';
import { PaginatedModel } from '../../shared/models/paginatedModel';
import { ThingByName } from '../../shared/models/thingByName';
import { LocationRepository } from '../../core/repositories/location.repository';
import { TypeLocationCount } from '../../shared/models/dashboard/TypeLocationCount';

export interface ThingTrackModel {
  thingId: string;
  document: string;
  name: string;
  devicesLocation: DeviceLocation[];
  lastDeviceLocation?: DeviceLocation;
  filteredFrom?: string;
  filteredTill?: string;
  middleware?: string;
  typeAccess?: string;
  filteredInterval?: number;
}

export class ThingsStateModel {
  public things: Thing[];

  // map states
  public thingsToDisplayAtMap: Thing[];

  public latestEventDate?: Date;

  public thingsAsPaginatedList: PaginatedModel<Thing[]>;

  public thingsCount: number;

  public typeLocationCount: TypeLocationCount;

  public thingTracking?: ThingTrackModel;

  public refreshTimeInfo: Date;

  public refreshTimeInfoHistoricPage: Date;

  public thingsFilteredByNameList?: ThingByName[];

  public isFetchingThings: boolean;

  public httpErrorResponse?: HttpErrorResponse;
}

const INITIAL_STATE: ThingsStateModel = {
  things: [],
  thingsToDisplayAtMap: [],
  thingsAsPaginatedList: {
    data: [],
    totalCount: 0,
    page: 1,
    perPage: 10
  },
  thingsCount: 0,
  typeLocationCount: {
    bus: 0,
    facialRecognition: 0,
    SmartBadge: 0,
    Spot: 0,
    securityCenter: 0,
    portable: 0,
    hasValue: false
  },
  refreshTimeInfo: null,
  refreshTimeInfoHistoricPage: null,
  thingsFilteredByNameList: [],
  latestEventDate: null,
  isFetchingThings: true,
  httpErrorResponse: null
};

@State<ThingsStateModel>({
  name: 'things',
  defaults: INITIAL_STATE
})
@Injectable()
export class ThingsState {
  @Selector()
  public static things(state: ThingsStateModel): Thing[] {
    return state.things;
  }

  @Selector()
  public static thingsToDisplayAtMap(state: ThingsStateModel): Thing[] {
    return state.thingsToDisplayAtMap;
  }

  @Selector()
  public static httpErrorResponse(state: ThingsStateModel): HttpErrorResponse {
    return state.httpErrorResponse;
  }

  @Selector()
  public static thingsAsPaginatedList(
    state: ThingsStateModel
  ): PaginatedModel<Thing[]> {
    return state.thingsAsPaginatedList;
  }

  @Selector()
  public static thingsCount(state: ThingsStateModel): number {
    return state.thingsCount;
  }

  @Selector()
  public static typeLocationCount(state: ThingsStateModel): TypeLocationCount {
    return state.typeLocationCount;
  }

  @Selector()
  public static thingTracking(state: ThingsStateModel): ThingTrackModel {
    return state.thingTracking;
  }

  @Selector()
  public static refreshTimeInfo(state: ThingsStateModel): Date {
    return state.refreshTimeInfo;
  }

  @Selector()
  public static refreshTimeInfoHistoricPage(state: ThingsStateModel): Date {
    return state.refreshTimeInfoHistoricPage;
  }

  @Selector()
  public static thingsFilteredByNameList(
    state: ThingsStateModel
  ): ThingByName[] {
    return state.thingsFilteredByNameList;
  }

  @Selector()
  public static isFetchingThings(state: ThingsStateModel): boolean {
    return state.isFetchingThings;
  }

  constructor(private locationRepository: LocationRepository) {}

  @Action(UpdateThingsState)
  public updateThingsState(
    { patchState }: StateContext<ThingsStateModel>,
    { thingsStateModel }: UpdateThingsState
  ): void {
    patchState(thingsStateModel);
  }

  @Action(UpdateThingTracking)
  public updateThingTracking(
    { patchState }: StateContext<ThingsStateModel>,
    { thingTracking }: UpdateThingTracking
  ): void {
    patchState({ thingTracking });
  }

  @Action(ClearThingsStore)
  public clearThingsStore({ setState }: StateContext<ThingsStateModel>): void {
    setState(INITIAL_STATE);
  }

  @Action(UpdateRefreshTimeInfo)
  public updateRefreshTimeInfo(
    { patchState }: StateContext<ThingsStateModel>,
    { refreshTimeInfo }: UpdateRefreshTimeInfo
  ): void {
    patchState({ refreshTimeInfo });
  }

  @Action(FetchThingsByName, { cancelUncompleted: true })
  public fetchThingsByName(
    { dispatch }: StateContext<ThingsStateModel>,
    { name }: FetchThingsByName
  ): Observable<Observable<any>> {
    return this.locationRepository
      .getThingsByName(name)
      .pipe(map(things => dispatch(new FetchThingsByNameSuccess(things))));
  }

  @Action(FetchThingsByNameSuccess)
  public updateFilteredThingsByNameSuccess(
    { patchState }: StateContext<ThingsStateModel>,
    { thingsFilteredByNameList }: FetchThingsByNameSuccess
  ): void {
    patchState({ thingsFilteredByNameList });
  }

  @Action(ClearFilterdThingsList)
  public clearFilterdThingsList({
    patchState
  }: StateContext<ThingsStateModel>): void {
    patchState({ thingsFilteredByNameList: [] });
  }

  @Action(UpdateHttpErrorResponse)
  public updateHttpErrorResponse(
    { patchState }: StateContext<ThingsStateModel>,
    { httpErrorResponse }: UpdateHttpErrorResponse
  ): void {
    patchState({ httpErrorResponse });
  }
}
