import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  LOCALE_ID,
  Inject,
} from '@angular/core';
import { formatNumber } from '@angular/common';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Observable } from 'rxjs';
import { ApplicationDevicesAssociationSummary } from 'src/app/model/applications-interfaces';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import { LoggingService } from 'src/app/services/logging/logging.service';

@Component({
  selector: 'app-devices-association-summary',
  templateUrl: './devices-association-summary.component.html',
  styleUrls: ['./devices-association-summary.component.scss'],
})
export class DevicesAssociationSummaryComponent implements OnChanges {
  @Input() applicationId: string;

  public applications$: Observable<any>;

  public totalCount: string;

  public associatedDevicesCount: string;

  public disassociatedDevicesCount: string;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private applicationService: ApplicationsService,
    private loggingSrevice: LoggingService,
  ) {}

  ngOnChanges({ applicationId }: SimpleChanges): void {
    const { currentValue, previousValue } = applicationId;

    if (currentValue !== previousValue) {
      this.refreshDevicesAssociationSummary(currentValue);
    }
  }

  refreshDevicesAssociationSummary(applicationId: string) {
    this.applications$ = this.applicationService.getDevicesAssociationSummary(
      applicationId,
    );
    this.applications$.subscribe(
      (data: ApplicationDevicesAssociationSummary) => {
        this.totalCount = formatNumber(data.totalCount, this.locale);
        this.associatedDevicesCount = formatNumber(
          data.associatedDevicesCount,
          this.locale,
        );
        this.disassociatedDevicesCount = formatNumber(
          data.disassociatedDevicesCount,
          this.locale,
        );
      },
      error => this.loggingSrevice.logException(error, SeverityLevel.Warning),
    );
  }
}
