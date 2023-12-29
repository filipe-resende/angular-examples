import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Site } from '../../shared/models/site';
import { SitesService } from '../../stores/sites/sites.service';
import { ThingsService } from '../../stores/things/things.service';
import { Thing } from '../../shared/models/thing';
import { Perimeter } from '../../shared/models/perimeter';
import { PerimetersService } from '../../stores/perimeters/perimeters.service';
import { MapTwoComponent } from '../../components/smart/map-two/map-two.component';
import { FeatureFlagsStateService } from '../../stores/feature-flags/feature-flags-state.service';
import { FeatureFlags } from '../../core/constants/feature-flags.const';
import { RealTimeSelectorService } from '../../stores/real-time-events-selector/real-time-events-selector.service';
import { TWELVE_HOURS_IN_MINUTES } from '../../shared/constants';
import { TypeLocationCount } from '../../shared/models/dashboard/TypeLocationCount';

@Component({
  selector: 'app-navigation',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class DashboardPage implements OnInit {
  @ViewChild(MapTwoComponent) public googleMapRef: MapTwoComponent;

  public selectedSite: Site;

  public things$: Observable<Thing[]>;

  public thingsCount$: Observable<number>;

  public typeLocationCount$: Observable<TypeLocationCount>;

  public isFetchingThings$: Observable<boolean>;

  public refreshTimeInfo$: Observable<Date>;

  public isRealTimeSearchSelected$: Observable<boolean>;

  private thingsRefreshTimeout: NodeJS.Timeout;

  public showDeviceGroupDisclaimer = false;

  public deviceGroupFiltering = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private sitesService: SitesService,
    private thingsService: ThingsService,
    private perimetersService: PerimetersService,
    private realTimeSelectorService: RealTimeSelectorService,
    private featureFlagsStateService: FeatureFlagsStateService,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.isFetchingThings$ = this.thingsService.isFetchingThings$;
    this.things$ = this.thingsService.things$;
    this.thingsCount$ = this.thingsService.thingsCount$;
    this.typeLocationCount$ = this.thingsService.typeLocationCount$;
    this.isRealTimeSearchSelected$ =
      this.realTimeSelectorService.isRealTimeSearch$;
    this.refreshTimeInfo$ = this.setupRefreshTimerInfoObs();
    const featureflagsSubscription$ =
      this.featureFlagsStateService.activeFeatureFlags$.subscribe(
        featureFlags => {
          this.showDeviceGroupDisclaimer = featureFlags.some(
            featureFlag =>
              featureFlag.name === FeatureFlags.DeviceGroupDisclaimer
          );
          this.deviceGroupFiltering = featureFlags.some(
            featureFlag =>
              featureFlag.name === FeatureFlags.DeviceGroupFiltering
          );
        }
      );
    this.subscriptions.push(featureflagsSubscription$);

    this.onSelectedSiteChangeHandler();
    this.onThingsChangeHandler();
    this.onPerimetersChangeHandler();
  }

  public ngAfterViewInit(): void {
    if (this.selectedSite) {
      this.setSiteOnMap(this.selectedSite);
    }
  }

  public ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }

    clearTimeout(this.thingsRefreshTimeout);
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (this.isSiteValid(selectedSite)) {
          this.setSiteOnMap(selectedSite);

          this.realTimeSelectorService.isRealTimeSearch$
            .pipe(
              filter(isRealTimeSearch => isRealTimeSearch != null),
              take(1)
            )
            .subscribe(isRealTimeSearch => {
              this.thingsService.updateThingsState({ isFetchingThings: true });
              this.thingsService.clearThings();
              this.thingsService
                .syncThingsByLastLocation({
                  site: selectedSite,
                  periodInMinutesToFilter: TWELVE_HOURS_IN_MINUTES,
                  isRealTimeSearch
                })
                .finally(() => {
                  this.thingsService.updateThingsState({
                    isFetchingThings: false
                  });
                });
            });
        }
      }
    );
    this.subscriptions.push(selectedSite$);
  }

  private isSiteValid(selectedSite: Site): boolean {
    return selectedSite && Object.keys(selectedSite).length > 0;
  }

  private onThingsChangeHandler(): void {
    const things$ = this.thingsService.things$.subscribe(things => {
      if (things) {
        this.setThingsHeatMap(things);

        clearTimeout(this.thingsRefreshTimeout);

        const TWO_MINUTES_AND_A_HALF_SECOND = 120_500;

        const periodToFilter = things.length ? null : TWELVE_HOURS_IN_MINUTES;

        this.thingsRefreshTimeout = setTimeout(() => {
          this.realTimeSelectorService.isRealTimeSearch$
            .pipe(
              filter(isRealTimeSearch => isRealTimeSearch != null),
              take(1)
            )
            .subscribe(isRealTimeSearch => {
              this.thingsService.updateThingsState({ isFetchingThings: true });
              this.thingsService
                .syncThingsByLastLocation({
                  site: this.selectedSite,
                  periodInMinutesToFilter: periodToFilter,
                  isRealTimeSearch
                })
                .finally(() => {
                  this.thingsService.updateThingsState({
                    isFetchingThings: false
                  });
                });
            });
        }, TWO_MINUTES_AND_A_HALF_SECOND);
      }
    });

    this.subscriptions.push(things$);
  }

  private onPerimetersChangeHandler() {
    const perimeters$ = this.perimetersService.perimeters$.subscribe(
      perimeters => {
        if (perimeters.length) {
          this.setPerimeterOnMap(perimeters);
        }
      }
    );

    this.subscriptions = [...this.subscriptions, perimeters$];
  }

  private setupRefreshTimerInfoObs(): Observable<Date> {
    return this.thingsService.refreshTimeInfo$.pipe(
      filter((refreshDate: Date) => !!refreshDate)
    );
  }

  // #region MAP

  private tryExecuteCallbackOnMap(callback: () => void): void {
    if (this.googleMapRef) {
      callback();
    } else {
      const HALF_SECOND_IN_MILLISECONDS = 0.5 * 1000;

      setTimeout(
        () => this.tryExecuteCallbackOnMap(callback),
        HALF_SECOND_IN_MILLISECONDS
      );
    }
  }

  private setSiteOnMap(site: Site): void {
    this.tryExecuteCallbackOnMap(() => {
      const { latitude: lat, longitude: lng, zoom } = site;

      const options: google.maps.MapOptions = { center: { lat, lng }, zoom };
      this.googleMapRef.setMap(options);
    });
  }

  private setPerimeterOnMap(perimeters: Perimeter[]) {
    this.tryExecuteCallbackOnMap(() => {
      this.googleMapRef.setPerimetersOnMap(perimeters);
    });
  }

  private setThingsHeatMap(things: Thing[]) {
    this.tryExecuteCallbackOnMap(() => {
      const coordinates = things.map(({ latitude, longitude }) => ({
        lat: latitude,
        lng: longitude
      }));

      this.googleMapRef.setHeatMap(coordinates);
    });
  }
  // #endregion
}
