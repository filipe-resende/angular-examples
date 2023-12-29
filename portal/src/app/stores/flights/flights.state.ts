import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Flights } from '../../shared/models/flights';
import { FlightsCounter } from '../../shared/models/flights-counter';
import { FlightsPassengers } from '../../shared/models/flights-passangers';
import { PaginatedList } from '../../shared/models/paginated-list';
import {
  SetFlightsCounterState,
  SetFlightsState,
  SetIsFetchingCountersState,
  SetIsFetchingFlightsState,
  SetIsFetchingPassengersState,
  SetPassengersState,
  SetSelectedFlightState
} from './flights.actions';

export class SelectedFlight {
  public currentFlight: Flights;

  public from: string;

  public to: string;

  public pageIndex: number;

  public pageSize: number;
}

export class FlightsStateModel {
  public flights: PaginatedList<Flights>;

  public passengers: PaginatedList<FlightsPassengers>;

  public counters: FlightsCounter[];

  public isFetchingCounters: boolean;

  public isFetchingFlights: boolean;

  public isFetchingPassengers: boolean;

  public selectedFlight: SelectedFlight;
}

const INITIAL_STATE: FlightsStateModel = undefined;

@State({
  name: 'flights',
  defaults: INITIAL_STATE
})
export class FlightsState {
  @Selector()
  public static flights(state: FlightsStateModel): PaginatedList<Flights> {
    return state.flights;
  }

  @Selector()
  public static flightsPassengers(
    state: FlightsStateModel
  ): PaginatedList<FlightsPassengers> {
    return state.passengers;
  }

  @Selector()
  public static counters(state: FlightsStateModel): FlightsCounter[] {
    return state.counters;
  }

  @Selector()
  public static isFetchingFlights(state: FlightsStateModel): boolean {
    return state.isFetchingFlights;
  }

  @Selector()
  public static isFetchingCounters(state: FlightsStateModel): boolean {
    return state.isFetchingCounters;
  }

  @Selector()
  public static isFetchingPassengers(state: FlightsStateModel): boolean {
    return state.isFetchingPassengers;
  }

  @Selector()
  public static leavingEventsCount(state: FlightsStateModel): number {
    const counter = state.counters.find(x => x.direction === 'Leaving');

    return counter ? counter.numberOfThings : null;
  }

  @Selector()
  public static enteringEventsCount(state: FlightsStateModel): number {
    const counter = state.counters.find(x => x.direction === 'Entering');

    return counter ? counter.numberOfThings : null;
  }

  @Selector()
  public static selectedFlight(state: FlightsStateModel) {
    return state.selectedFlight;
  }

  @Action(SetFlightsState)
  public setFlightsState(
    { patchState }: StateContext<FlightsStateModel>,
    { flights }: SetFlightsState
  ) {
    patchState({
      flights
    });
  }

  @Action(SetPassengersState)
  public setPassengersState(
    { patchState }: StateContext<FlightsStateModel>,
    { flighsPassengers }: SetPassengersState
  ) {
    patchState({
      passengers: flighsPassengers
    });
  }

  @Action(SetFlightsCounterState)
  public setFlightsCounterState(
    { patchState }: StateContext<FlightsStateModel>,
    { flightsCounter }: SetFlightsCounterState
  ) {
    patchState({
      counters: flightsCounter
    });
  }

  @Action(SetIsFetchingCountersState)
  public setIsFetchingCountersState(
    { patchState }: StateContext<FlightsStateModel>,
    { isFetchingCounters }: SetIsFetchingCountersState
  ) {
    patchState({
      isFetchingCounters
    });
  }

  @Action(SetIsFetchingPassengersState)
  public setIsFetchingPassengersState(
    { patchState }: StateContext<FlightsStateModel>,
    { isFetchingPassengers }: SetIsFetchingPassengersState
  ) {
    patchState({
      isFetchingPassengers
    });
  }

  @Action(SetIsFetchingFlightsState)
  public setIsFetchingFlightsState(
    { patchState }: StateContext<FlightsStateModel>,
    { isFetchingFlights }: SetIsFetchingFlightsState
  ) {
    patchState({
      isFetchingFlights
    });
  }

  @Action(SetSelectedFlightState)
  public setSelectedFlightState(
    { patchState }: StateContext<FlightsStateModel>,
    { selectedFlight }: SetSelectedFlightState
  ) {
    patchState({
      selectedFlight
    });
  }
}
