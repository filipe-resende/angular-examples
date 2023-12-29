import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { filter } from 'rxjs/operators';
import { FlightsRepository } from '../../core/repositories/flights.repository';
import {
  SetFlightsCounterState,
  SetFlightsState,
  SetIsFetchingCountersState,
  SetIsFetchingFlightsState,
  SetIsFetchingPassengersState,
  SetPassengersState,
  SetSelectedFlightState
} from './flights.actions';
import { Flights } from '../../shared/models/flights';
import { PaginatedList } from '../../shared/models/paginated-list';
import { FlightsPassengers } from '../../shared/models/flights-passangers';
import { FlightsCounter } from '../../shared/models/flights-counter';
import {
  FlightsState,
  FlightsStateModel,
  SelectedFlight
} from './flights.state';
import { FlightOrGateEventType } from '../../shared/enums/flightsAndGates';
import { UserProfileService } from '../user-profile/user-profile.service';

export interface ExportPathParamsObj {
  from: string;
  to: string;
  flight: string;
  airport: string;
  direction: string;
  type: FlightOrGateEventType;
}

@Injectable({
  providedIn: 'root'
})
export class FlightsService {
  private flightsSubscription: Subscription = new Subscription();

  private passengersSubscription: Subscription = new Subscription();

  private countersSubscription: Subscription = new Subscription();

  public unsubscribeAll(): void {
    this.flightsSubscription.unsubscribe();
    this.passengersSubscription.unsubscribe();
    this.countersSubscription.unsubscribe();
  }

  @Select(FlightsState.flights)
  public flights$: Observable<PaginatedList<Flights>>;

  @Select(FlightsState.flightsPassengers)
  public passengers$: Observable<PaginatedList<FlightsPassengers>>;

  @Select(FlightsState.leavingEventsCount)
  public leavingEventsCount$: Observable<number>;

  @Select(FlightsState.enteringEventsCount)
  public enteringEventsCount$: Observable<number>;

  @Select(FlightsState.isFetchingFlights)
  public isFetchingFlights$: Observable<boolean>;

  @Select(FlightsState.isFetchingPassengers)
  public isFetchingPassengers$: Observable<boolean>;

  @Select(FlightsState.selectedFlight)
  public selectedFlight$: Observable<SelectedFlight>;

  @Select(FlightsState.counters)
  public counters$: Observable<FlightsCounter[]>;

  @Select(FlightsState.isFetchingCounters)
  public isFetchingCounters$: Observable<boolean>;

  constructor(
    private store: Store,
    private flightsRepository: FlightsRepository,
    private userProfileService: UserProfileService
  ) {}

  @Dispatch()
  public updateFlightsState(flights: PaginatedList<Flights>): SetFlightsState {
    return new SetFlightsState(flights);
  }

  @Dispatch()
  public updatePassengersState(
    flightsPassengers: PaginatedList<FlightsPassengers>
  ): SetPassengersState {
    return new SetPassengersState(flightsPassengers);
  }

  @Dispatch()
  public updateFlightsCounterState(
    flightsCounter: FlightsCounter[]
  ): SetFlightsCounterState {
    return new SetFlightsCounterState(flightsCounter);
  }

  @Dispatch()
  public updateIsFetchingFlightsState(
    isFetchingFlights: boolean
  ): SetIsFetchingFlightsState {
    return new SetIsFetchingFlightsState(isFetchingFlights);
  }

  @Dispatch()
  public updateIsFetchingCountersState(
    isFetchingCounters: boolean
  ): SetIsFetchingCountersState {
    return new SetIsFetchingCountersState(isFetchingCounters);
  }

  @Dispatch()
  public updateIsFetchingPassengersState(
    isFetchingPassengers: boolean
  ): SetIsFetchingPassengersState {
    return new SetIsFetchingPassengersState(isFetchingPassengers);
  }

  @Dispatch()
  public updateSelectedFlightState(
    selectedFlight: SelectedFlight
  ): SetSelectedFlightState {
    return new SetSelectedFlightState(selectedFlight);
  }

  public getStore(): FlightsStateModel {
    return this.store.snapshot().flights as FlightsStateModel;
  }

  public exportPassengers(parameters: ExportPathParamsObj): Promise<void> {
    const email = this.userProfileService.getUserProfile()?.email;
    return this.flightsRepository
      .exportPassengers(
        parameters.from,
        parameters.to,
        parameters.flight,
        parameters.airport,
        parameters.direction,
        parameters.type,
        email
      )
      .toPromise();
  }

  public getFlights(
    from: string,
    to: string,
    pageSize = 10,
    pageIndex = 1,
    type?: FlightOrGateEventType,
    flightNumber?: string
  ): void {
    this.updateIsFetchingFlightsState(true);

    this.flightsSubscription = this.flightsRepository
      .getFlights(from, to, pageSize, pageIndex, type, flightNumber)
      .pipe(filter(x => !!x))
      .subscribe(
        flights => {
          flights.items = this.formatDateTimeToUtc(flights);
          this.updateFlightsState(flights);
          this.updateIsFetchingFlightsState(false);
        },
        () => {
          this.updateIsFetchingFlightsState(false);
        }
      );
  }

  public getPassengers(
    from: string,
    to: string,
    flight: string,
    airport: string,
    direction: string,
    type: FlightOrGateEventType,
    pageSize = 10,
    pageIndex = 1
  ): void {
    this.updateIsFetchingPassengersState(true);
    this.passengersSubscription = this.flightsRepository
      .getPassengers(
        from,
        to,
        flight,
        airport,
        direction,
        type,
        pageSize,
        pageIndex
      )
      .pipe(filter(x => !!x))
      .subscribe(
        passengers => {
          passengers.items = this.formatDateTimeToUtc(passengers);
          this.updatePassengersState(passengers);
          this.updateIsFetchingPassengersState(false);
        },
        () => {
          this.updateIsFetchingPassengersState(false);
        }
      );
  }

  private formatDateTimeToUtc(
    data: PaginatedList<FlightsPassengers> | PaginatedList<Flights>
  ) {
    return data.items.map(item => {
      if (item.latestReportTime && !item.latestReportTime.includes('Z')) {
        item.latestReportTime = `${item.latestReportTime}Z`;
      }
      return item;
    });
  }

  public getCounters(from: string, to: string): void {
    this.updateIsFetchingFlightsState(true);
    this.countersSubscription = this.flightsRepository
      .getCounters(from, to)
      .pipe(filter(x => !!x))
      .subscribe(
        flightsCounter => {
          this.updateFlightsCounterState(flightsCounter);
          this.updateIsFetchingCountersState(false);
        },
        () => {
          this.updateIsFetchingCountersState(false);
        }
      );
  }
}
