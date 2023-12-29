import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FlightsService } from '../../../stores/flights/flights.service';

@Component({
  selector: 'app-flights-counter',
  templateUrl: './flights-counter.component.html',
  styleUrls: ['./flights-counter.component.scss']
})
export class FlightsCounterComponent implements OnInit {
  public peopleCounter = {
    insideVale: '-',
    outsideVale: '-'
  };

  public isFetching = false;

  public isFetchingCounters$: Observable<boolean>;

  constructor(private flightsService: FlightsService) {}

  public ngOnInit() {
    this.isFetchingCounters$ = this.flightsService.isFetchingCounters$;

    this.flightsService.isFetchingCounters$
      .pipe(filter(x => !!x))
      .subscribe(isFetching => {
        this.isFetching = isFetching;
      });

    this.flightsService.counters$.pipe(filter(x => !!x)).subscribe(
      counters => {
        this.peopleCounter.insideVale = counters
          .find(x => x.direction === 'Entering')
          ?.numberOfThings.toString();

        this.peopleCounter.outsideVale = counters
          .find(x => x.direction === 'Leaving')
          ?.numberOfThings.toString();

        this.isFetching = false;
        this.flightsService.updateIsFetchingCountersState(false);
      },
      () => {
        this.flightsService.updateIsFetchingCountersState(false);
        this.peopleCounter = {
          insideVale: '-',
          outsideVale: '-'
        };
      }
    );
  }
}
