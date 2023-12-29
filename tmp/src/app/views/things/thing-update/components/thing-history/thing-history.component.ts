/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { AssociationDesassociationScreenEnum } from 'src/app/shared/enums/associationDesassociationScreen';
import { ApplicationsStateService } from 'src/app/stores/applications/applications-state.service';

@Component({
  selector: 'app-thing-history',
  templateUrl: 'thing-history.component.html',
  styleUrls: ['thing-history.component.scss'],
})
export class ThingHistoryComponent implements OnInit, OnChanges {
  @Input() thingId: string;

  @Input() firstDate: string;

  @Input() lastDate: string;

  @Input() firstDateHour: string;

  @Input() lastDateHour: string;

  @Output() emitDefaultValues = new EventEmitter();

  public applications: ApplicationItem[];

  public historyData;

  public hasHistoryData = false;

  public distinctIdList = [];

  public activeButton = false;

  public modalRef: BsModalRef;

  public applications$: Observable<ApplicationItem[]>;

  constructor(
    private associationPeriodService: AssociationPeriodsService,
    private datePipe: DatePipe,
    private loggingService: LoggingService,
    private applicationStateService: ApplicationsStateService,
  ) {}

  public ngOnInit(): void {
    this.setDefaultDate();
    this.applications$ = this.setupApplicationsObs();
    this.applications$.subscribe(applications => {
      this.applications = applications;
      this.getHistoryData(this.thingId, this.firstDate, this.lastDate);
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.firstDate && this.lastDate) this.refreshHistory();
  }

  public setDefaultDate(): void {
    this.firstDate = '2010-01-01';
    this.lastDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd', '+24');
  }

  public getHistoryData(id, start, end): void {
    this.associationPeriodService
      .getThingsAssociations(id, start, end)
      .subscribe(
        (data: any) => {
          this.historyData = data;
          this.hasHistoryData =
            this.historyData != null &&
            this.historyData.associatedDevices.length > 0;
          this.historyData.associatedDevices.forEach(associatedDevice => {
            associatedDevice.isApplicationAssociable = this.applications.find(
              application =>
                application.id === associatedDevice.device.applicationId,
            )?.allowDeviceAssociation;
          });
          this.historyData.associatedDevices = this.historyData.associatedDevices.sort(
            (a, b) =>
              Date.parse(b.associationDate) - Date.parse(a.associationDate),
          );
        },
        (error: Error) =>
          this.loggingService.logException(error, SeverityLevel.Warning),
      );
  }

  public modalPayloadMapper(value) {
    return {
      associatedThings: [
        {
          id: value.id,
          thing: {
            id: this.thingId,
          },
        },
      ],
      device: {
        applicationId: value.device.applicationId,
        id: value.device.id,
      },
      screen: AssociationDesassociationScreenEnum.Things,
    };
  }

  private setupApplicationsObs(): Observable<ApplicationItem[]> {
    return this.applicationStateService.allApplications$.pipe(
      tap(applications => {
        if (!applications.length)
          this.applicationStateService.updateAllApplicationsList();
      }),
    );
  }

  private defineHour(value: string) {
    return value !== undefined ? value : 'T00:00:00';
  }

  private refreshHistory(): void {
    const brUTC = '-03:00';

    const firstDate =
      this.datePipe.transform(this.firstDate, 'yyyy-MM-dd') +
      this.defineHour(this.firstDateHour);

    const lastDate =
      this.datePipe.transform(this.lastDate, 'yyyy-MM-dd') +
      this.defineHour(this.lastDateHour);

    this.getHistoryData(this.thingId, firstDate + brUTC, lastDate + brUTC);
  }
}
