/* eslint no-param-reassign: "warn" */

import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import {
  TransportsState,
  TransportsStateModel,
  TransportsPeopleCounters,
  TransportsPaginatedList,
  TransportTrip,
  TransportCountItem,
  TransportFilters
} from './transports.state';
import {
  ClearTransportsStore,
  UpdateTransportsLines,
  UpdateSelectedTrip,
  UpdateIsFetchingTripThingsList,
  UpdateTripThings,
  UpdateTransportsPeopleCounters,
  UpdateTransportFilter,
  UpdateTelemetryCompanies
} from './transports.actions';
import {
  TransportsRepository,
  TransportsTripThings
} from '../../core/repositories/transports.repository';
import { TripThing } from '../../shared/models/trip-thing';
import { SitesService } from '../sites/sites.service';
import { Trip } from '../../shared/models/trip';
import { Telemetry } from '../../shared/models/telemetry';

@Injectable({
  providedIn: 'root'
})
export class TransportsService {
  private countersSubscription: Subscription = new Subscription();

  private transportLinesSubscription: Subscription = new Subscription();

  private tripThingsSubscription: Subscription = new Subscription();

  @Select(TransportsState.peopleCountersTotal)
  public peopleCountersTotal$: Observable<TransportCountItem>;

  @Select(TransportsState.peopleCountersInCirculars)
  public peopleCountersInCirculars$: Observable<TransportCountItem>;

  @Select(TransportsState.peopleCountersLeftVale)
  public peopleCountersLeftVale$: Observable<TransportCountItem>;

  @Select(TransportsState.peopleCountersOnTheWay)
  public peopleCountersOnTheWay$: Observable<TransportCountItem>;

  @Select(TransportsState.peopleCountersLandedInsideVale)
  public peopleCountersLandedInsideVale$: Observable<TransportCountItem>;

  @Select(TransportsState.peopleCountersLandedOutsideVale)
  public peopleCountersLandedOutsideVale$: Observable<TransportCountItem>;

  @Select(TransportsState.transportsPaginatedList)
  public transportsPaginatedList$: Observable<TransportsPaginatedList>;

  @Select(TransportsState.transportsFilter)
  public transportsFilter$: Observable<TransportFilters>;

  @Select(TransportsState.selectedTrip)
  public selectedTrip$: Observable<TransportTrip>;

  @Select(TransportsState.tripThingsList)
  public tripThings$: Observable<TripThing[]>;

  @Select(TransportsState.transportsNamesList)
  public transportsNamesList$: Observable<Trip[]>;

  @Select(TransportsState.isFetchingTripThingsList)
  public isFetchingTripThingsList$: Observable<boolean>;

  @Select(TransportsState.telemetryCompanies)
  public telemetryCompanies$: Observable<Telemetry[]>;

  constructor(
    private store: Store,
    private transportsRepository: TransportsRepository,
    private siteService: SitesService
  ) {}

  public getStore(): TransportsStateModel {
    return this.store.snapshot().transports as TransportsStateModel;
  }

  /**
   * Atualiza os contadores de pessoas que estão em algum transporte no momento
   */
  @Dispatch()
  public updatePeopleCounters(
    peopleCounters: Partial<TransportsPeopleCounters>
  ): UpdateTransportsPeopleCounters {
    return new UpdateTransportsPeopleCounters(peopleCounters);
  }

  @Dispatch()
  public updatePaginatedTransportsLines(
    transportsPaginatedList: TransportsPaginatedList
  ): UpdateTransportsLines {
    return new UpdateTransportsLines(transportsPaginatedList);
  }

  @Dispatch()
  public updateTripThings(tripThings: TripThing[]): UpdateTripThings {
    return new UpdateTripThings(tripThings);
  }

  @Dispatch()
  public updateTransportFilter(
    filters: TransportFilters
  ): UpdateTransportFilter {
    return new UpdateTransportFilter(filters);
  }

  @Dispatch()
  public updateIsFetchingTripThingsList(
    isFetchingTripThingsList: boolean
  ): UpdateIsFetchingTripThingsList {
    return new UpdateIsFetchingTripThingsList(isFetchingTripThingsList);
  }

  @Dispatch()
  public updateSelectedTrip(selectedTrip: TransportTrip): UpdateSelectedTrip {
    this.updateIsFetchingTripThingsList(true);

    this.syncPeopleFromSelectedTrip(selectedTrip);

    return new UpdateSelectedTrip(selectedTrip);
  }

  @Dispatch()
  public updateTelemetryCompanies(
    telemetryCompanies: Telemetry[]
  ): UpdateTelemetryCompanies {
    return new UpdateTelemetryCompanies(telemetryCompanies);
  }

  public resetRequests(): void {
    this.updateIsFetchingTripThingsList(false);
    this.countersSubscription.unsubscribe();
    this.tripThingsSubscription.unsubscribe();
    this.transportLinesSubscription.unsubscribe();
    // REMOVER
    // this.transportLinesNamesSubscription.unsubscribe();
  }

  /**
   * Limpa toda store de transports
   */
  @Dispatch()
  public clearTransportsStore(): ClearTransportsStore {
    return new ClearTransportsStore();
  }

  /**
   * Sincroniza as things (pessoas) ligadas a trip selecionada
   */
  public syncPeopleFromSelectedTrip(
    selectedTrip: TransportTrip
  ): Promise<TripThing[]> {
    const selectedSite = this.siteService.getSelectedSite();

    return new Promise((resolve, reject) => {
      if (selectedTrip) {
        const { code, from, till } = selectedTrip;

        const onSuccessCallback = (tripThings: TransportsTripThings[]) => {
          const tripThingsMapped: TripThing[] = tripThings.map(
            ({ cardId, document, name, type, company, location, date }) => ({
              tripCode: code,
              cardId,
              document,
              location: {
                lat: location[1],
                lng: location[0]
              },
              eventDateTime: date && new Date(date),
              company,
              type,
              name
            })
          );

          this.updateTripThings(tripThingsMapped);

          this.tripThingsSubscription.unsubscribe();
          this.updateIsFetchingTripThingsList(false);

          resolve(tripThingsMapped);
        };

        const onErrorCallback = error => {
          this.updateTripThings([]);

          this.updateIsFetchingTripThingsList(false);

          reject(error);
        };

        this.tripThingsSubscription.unsubscribe();

        this.tripThingsSubscription = this.transportsRepository
          .getTripThings(selectedSite, code, from, till)
          .subscribe(onSuccessCallback, onErrorCallback);
      } else {
        reject(new Error('selectedTrip must have a value'));
      }
    });
  }

  /**
   * Sincroniza o state das listagem de transportes com os dados da página requisitada
   * @param page página que deseja obter. 0 é inicial
   * @param pageSize quantos registros por página
   * @param from filtro data inicial
   * @param till filtro data final
   * @param line filtra as viagens por uma linha especifica
   */
  public syncTransportsLinesPaginated(
    page: number,
    pageSize: number,
    isTripSearch: boolean,
    from?: string,
    till?: string,
    line?: string,
    direction?: string,
    plate?: string,
    telemetry?: string
  ): Promise<Trip[]> {
    const site = isTripSearch ? this.siteService.getSelectedSite() : null;

    return new Promise((resolve, reject) => {
      const onSuccessCallback = ({ body: linesObject }) => {
        const { totalCount } = linesObject;

        if (linesObject.busLine) {
          linesObject = linesObject.busLine;
        }

        const linesMapped: Trip[] = linesObject.map(
          ({
            code,
            line,
            companyName,
            telemetry,
            lastLocationLongitude,
            lastLocationLatitude,
            registrationDate,
            direction,
            category,
            people,
            initialPointLongitude,
            initialPointLatitude,
            finalPointLongitude,
            finalPointLatitude,
            licensePlate,
            startDateTrip,
            finalDateTrip
          }) => ({
            code,
            line,
            telemetry,
            companyName,
            lastLocation: {
              lat: lastLocationLatitude,
              lng: lastLocationLongitude
            },
            eventDateTime: registrationDate,
            startDateTrip,
            finalDateTrip,
            direction,
            category,
            peopleInLineCount: people,
            busPlate: licensePlate,
            initialPointLocation: {
              lat: initialPointLatitude,
              lng: initialPointLongitude
            },
            finalPointLocation: {
              lat: finalPointLatitude,
              lng: finalPointLongitude
            }
          })
        );

        this.updatePaginatedTransportsLines({
          list: linesMapped,
          totalCount
        });

        this.transportLinesSubscription.unsubscribe();
        resolve(linesMapped);
      };

      const onErrorCallback = error => {
        this.updatePaginatedTransportsLines({
          list: [],
          totalCount: 0
        });

        reject(error);
      };

      this.transportLinesSubscription.unsubscribe();

      this.transportLinesSubscription = this.transportsRepository
        .getTripsPaginated(
          page,
          pageSize,
          site,
          from,
          till,
          line,
          direction,
          plate,
          telemetry
        )
        .subscribe(onSuccessCallback, onErrorCallback);
    });
  }

  public async getTelemetryCompanies() {
    try {
      const telemetryCompanies = await this.transportsRepository
        .getTelemetryCompanies()
        .toPromise();

      this.updateTelemetryCompanies(telemetryCompanies);
    } catch (error) {
      this.updateTelemetryCompanies([]);
    }
  }

  private setAllCountersIsFetchingTrue() {
    const {
      counters: {
        people: {
          total: { value: totalValue },
          landedOutsideVale: { value: landedOutsideValeValue },
          onTheWay: { value: onTheWayValue },
          leftVale: { value: leftValeValue },
          inCirculars: { value: inCircularsValue },
          landedInsideVale: { value: landedInsideValeValue }
        }
      }
    } = this.getStore();

    this.updatePeopleCounters({
      total: { value: totalValue, isFetching: true },
      inCirculars: { value: inCircularsValue, isFetching: true },
      landedInsideVale: { value: landedInsideValeValue, isFetching: true },
      landedOutsideVale: { value: landedOutsideValeValue, isFetching: true },
      leftVale: { value: leftValeValue, isFetching: true },
      onTheWay: { value: onTheWayValue, isFetching: true }
    });
  }
}
