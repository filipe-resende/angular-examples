import { Action, State, StateContext, Selector } from '@ngxs/store';

import {
  ClearTransportsStore,
  UpdateTransportsLines,
  UpdateSelectedTrip,
  UpdateTripThings,
  UpdateIsFetchingTripThingsList,
  UpdateTransportsPeopleCounters,
  UpdateTransportFilter,
  UpdateTelemetryCompanies,
} from './transports.actions';
import { cloneObject } from '../../shared/utils/clone';
import { Trip } from '../../shared/models/trip';
import { TripThing } from '../../shared/models/trip-thing';
import { Telemetry } from '../../shared/models/telemetry';

export interface TransportCountItem {
  value: number;
  isFetching: boolean;
}

export interface TransportsPeopleCounters {
  total: TransportCountItem;
  onTheWay: TransportCountItem;
  inCirculars: TransportCountItem;
  leftVale: TransportCountItem;
  landedInsideVale: TransportCountItem;
  landedOutsideVale: TransportCountItem;
}

export interface TransportFilters {
  startDate?: string;
  endDate?: string;
  startHour?: string;
  endHour?: string;
  lineName?: string;
  direction?: string;
  plate?: string;
  telemetry?: string;
  sourceApplicationId?: string;
}

export interface TransportsPaginatedList {
  list: Trip[];
  totalCount: number;
}

export interface TransportsCounters {
  people: TransportsPeopleCounters;
}

export interface TransportTrip {
  code: string;
  name: string;
  from: string;
  till: string;
}

export class TransportsStateModel {
  public filters: TransportFilters;

  public counters: TransportsCounters;

  public transportsPaginatedList: TransportsPaginatedList;

  public transportsNamesList: Trip[];

  public selectedTrip?: TransportTrip;

  public tripThingsList: TripThing[];

  public isFetchingTripThingsList: boolean;

  public telemetryCompanies: Telemetry[];
}

const INITIAL_STATE: TransportsStateModel = {
  filters: {
    endDate: null,
    endHour: null,
    startDate: null,
    startHour: null,
    lineName: null,
    direction: null,
    plate: null,
    telemetry: null,
    sourceApplicationId: null,
  },
  counters: {
    people: {
      total: { value: null, isFetching: false },
      onTheWay: { value: null, isFetching: false },
      inCirculars: { value: null, isFetching: false },
      leftVale: { value: null, isFetching: false },
      landedInsideVale: { value: null, isFetching: false },
      landedOutsideVale: { value: null, isFetching: false },
    },
  },
  transportsPaginatedList: {
    list: [],
    totalCount: 0,
  },
  transportsNamesList: [],
  tripThingsList: [],
  isFetchingTripThingsList: false,
  telemetryCompanies: [],
};

@State<TransportsStateModel>({
  name: 'transports',
  defaults: INITIAL_STATE,
})
export class TransportsState {
  // #region  [COUNTERS]

  @Selector()
  public static peopleCountersTotal(
    state: TransportsStateModel,
  ): TransportCountItem {
    return state.counters.people.total;
  }

  @Selector()
  public static peopleCountersOnTheWay(
    state: TransportsStateModel,
  ): TransportCountItem {
    return state.counters.people.onTheWay;
  }

  @Selector()
  public static peopleCountersLeftVale(
    state: TransportsStateModel,
  ): TransportCountItem {
    return state.counters.people.leftVale;
  }

  @Selector()
  public static peopleCountersInCirculars(
    state: TransportsStateModel,
  ): TransportCountItem {
    return state.counters.people.inCirculars;
  }

  @Selector()
  public static peopleCountersLandedInsideVale(
    state: TransportsStateModel,
  ): TransportCountItem {
    return state.counters.people.landedInsideVale;
  }

  @Selector()
  public static peopleCountersLandedOutsideVale(
    state: TransportsStateModel,
  ): TransportCountItem {
    return state.counters.people.landedOutsideVale;
  }

  // #endregion

  @Selector()
  public static transportsPaginatedList(
    state: TransportsStateModel,
  ): TransportsPaginatedList {
    return state.transportsPaginatedList;
  }

  @Selector()
  public static transportsFilter(
    state: TransportsStateModel,
  ): TransportFilters {
    return state.filters;
  }

  @Selector()
  public static selectedTrip(state: TransportsStateModel): TransportTrip {
    return state.selectedTrip;
  }

  @Selector()
  public static tripThingsList(state: TransportsStateModel): TripThing[] {
    return state.tripThingsList;
  }

  @Selector()
  public static transportsNamesList(state: TransportsStateModel): Trip[] {
    return state.transportsNamesList;
  }

  @Selector()
  public static isFetchingTripThingsList(state: TransportsStateModel): boolean {
    return state.isFetchingTripThingsList;
  }

  @Selector()
  public static telemetryCompanies(state: TransportsStateModel): Telemetry[] {
    return state.telemetryCompanies;
  }

  @Action(UpdateTransportsPeopleCounters)
  public updateTransportsPeopleCounters(
    { patchState, getState }: StateContext<TransportsStateModel>,
    { partialCounters }: UpdateTransportsPeopleCounters,
  ): void {
    const {
      counters: { people: peopleCounters },
    } = getState();

    const updatedCounters = cloneObject({
      ...peopleCounters,
      ...partialCounters,
    });

    patchState({
      counters: {
        people: updatedCounters,
      },
    });
  }

  @Action(UpdateTransportsLines)
  public updateTransportsLines(
    { patchState }: StateContext<TransportsStateModel>,
    { transportsPaginatedList }: UpdateTransportsLines,
  ): void {
    patchState({
      transportsPaginatedList,
    });
  }

  @Action(UpdateSelectedTrip)
  public updateSelectedTrip(
    { patchState }: StateContext<TransportsStateModel>,
    { selectedTrip }: UpdateSelectedTrip,
  ): void {
    patchState({ selectedTrip });
  }

  @Action(UpdateTripThings)
  public updateTripThings(
    { patchState }: StateContext<TransportsStateModel>,
    { tripThings }: UpdateTripThings,
  ): void {
    patchState({ tripThingsList: [...tripThings] });
  }

  @Action(UpdateIsFetchingTripThingsList)
  public updateIsFetchingTripThingsList(
    { patchState }: StateContext<TransportsStateModel>,
    { isFetchingTripThingsList }: UpdateIsFetchingTripThingsList,
  ): void {
    patchState({ isFetchingTripThingsList });
  }

  @Action(ClearTransportsStore)
  public clearGeofencesStore({
    setState,
  }: StateContext<TransportsStateModel>): void {
    setState(INITIAL_STATE);
  }

  @Action(UpdateTransportFilter)
  public updateTransportFilter(
    { patchState, getState }: StateContext<TransportsStateModel>,
    { transportPeopleFilters }: UpdateTransportFilter,
  ): void {
    const { filters } = getState();

    patchState({
      filters: { ...filters, ...transportPeopleFilters },
    });
  }

  @Action(UpdateTelemetryCompanies)
  public updateTelemetryCompanies(
    { patchState }: StateContext<UpdateTelemetryCompanies>,
    { telemetryCompanies }: UpdateTelemetryCompanies,
  ): void {
    patchState({ telemetryCompanies });
  }
}
