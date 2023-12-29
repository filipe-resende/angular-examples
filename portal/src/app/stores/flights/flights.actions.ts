import { Flights } from '../../shared/models/flights';
import { FlightsCounter } from '../../shared/models/flights-counter';
import { FlightsPassengers } from '../../shared/models/flights-passangers';
import { PaginatedList } from '../../shared/models/paginated-list';
import { SelectedFlight } from './flights.state';

export class SetFlightsState {
  public static readonly type = '[FLIGHTS_STATE] SetFlightsState';

  constructor(public flights: PaginatedList<Flights>) {}
}

export class SetPassengersState {
  public static readonly type = '[FLIGHT_PASSANGERS_STATE] SetPassengersState';

  constructor(public flighsPassengers: PaginatedList<FlightsPassengers>) {}
}

export class SetFlightsCounterState {
  public static readonly type =
    '[FLIGHTS_COUNTER_STATE] SetFlightsCounterState';

  constructor(public flightsCounter: FlightsCounter[]) {}
}

export class SetIsFetchingFlightsState {
  public static readonly type =
    '[FLIGHTS_IS_FETCHING_FLIGHTS_STATE] SetIsFetchingFlightsState';

  constructor(public isFetchingFlights: boolean) {}
}

export class SetIsFetchingCountersState {
  public static readonly type =
    '[FLIGHTS_IS_FETCHING_COUNTERS_STATE] SetIsFetchingCountersState';

  constructor(public isFetchingCounters: boolean) {}
}

export class SetIsFetchingPassengersState {
  public static readonly type =
    '[FLIGHTS_IS_FETCHING_PASSENGERS_STATE] SetIsFetchingPassengersState';

  constructor(public isFetchingPassengers: boolean) {}
}

export class SetSelectedFlightState {
  public static readonly type =
    '[FLIGHTS_SELECTED_FLIGHT_STATE] SetSelectedFlightState';

  constructor(public selectedFlight: SelectedFlight) {}
}
