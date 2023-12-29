import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { ThingItem } from 'src/app/model/things-interfaces';
import { ApplicationsService } from 'src/app/services/factories/applications.service';

import { LoggingService } from 'src/app/services/logging/logging.service';

@Component({
  selector: 'app-thing-list',
  templateUrl: 'things-list.component.html',
  styleUrls: ['things-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThingsListComponent implements OnInit {
  @Input() things: [];

  @Input() currentPage = 1;

  @Input() totalCount: number;

  @Input() filterOn: boolean;

  applications: ApplicationItem[];

  @Output() paginate = new EventEmitter();

  constructor(
    private loggingService: LoggingService,
    private router: Router,
    private applicationService: ApplicationsService,
  ) {}

  ngOnInit(): void {
    this.applicationService.getAll().subscribe(
      data => {
        this.applications = data.applications;
      },
      error => error,
    );
  }

  onSelect(thing: ThingItem): void {
    this.router
      .navigate([`things/update/${thing.id}`])
      .catch(error =>
        this.loggingService.logException(error, SeverityLevel.Warning),
      );
  }

  public changePage(page: number): void {
    this.currentPage = page;
    this.paginate.emit(page);
  }
}
