import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TWELVE_HOURS_IN_MINUTES } from '../../../shared/constants';
import { SearchType } from '../../../shared/enums/searchType';
import { Site } from '../../../shared/models/site';
import { RealTimeSelectorService } from '../../../stores/real-time-events-selector/real-time-events-selector.service';
import { SitesService } from '../../../stores/sites/sites.service';
import { ThingsService } from '../../../stores/things/things.service';

@Component({
  selector: 'app-real-time-events-selector',
  templateUrl: './real-time-events-selector.component.html',
  styleUrls: ['./real-time-events-selector.component.scss']
})
export class RealTimeEventsSelectorComponent implements OnInit {
  constructor(
    private sitesService: SitesService,
    private realTimeSelectorService: RealTimeSelectorService,
    private thingsService: ThingsService
  ) {}

  public selectSearchType: string;

  public isFetchingThings$: Observable<boolean>;

  public selectedSite$: Observable<Site>;

  ngOnInit(): void {
    this.realTimeSelectorService.isRealTimeSearch$.subscribe(
      isRealTimeSearch => {
        this.selectSearchType = isRealTimeSearch
          ? SearchType.realTime
          : SearchType.twelveHoursRange;
      }
    );
    this.isFetchingThings$ = this.thingsService.isFetchingThings$;
    this.selectedSite$ = this.sitesService.selectedSite$;
  }

  public onToggleSelectSearchType(value: string): void {
    this.sitesService.selectedSite$
      .pipe(
        filter(selectedSite => !!selectedSite),
        take(1)
      )
      .subscribe(selectedSite => {
        let isRealTimeSearch: boolean;

        if (value === SearchType.realTime) {
          this.selectSearchType = SearchType.realTime;
          isRealTimeSearch = true;
        } else {
          this.selectSearchType = SearchType.twelveHoursRange;
          isRealTimeSearch = false;
        }

        this.realTimeSelectorService.updateRealTimeSelectorState({
          isRealTimeSearch
        });

        this.thingsService.updateThingsState({ isFetchingThings: true });
        this.thingsService.clearThings();

        this.thingsService
          .syncThingsByLastLocation({
            site: selectedSite,
            periodInMinutesToFilter: TWELVE_HOURS_IN_MINUTES,
            isRealTimeSearch
          })
          .finally(() => {
            this.thingsService.updateThingsState({ isFetchingThings: false });
          });
      });
  }
}
