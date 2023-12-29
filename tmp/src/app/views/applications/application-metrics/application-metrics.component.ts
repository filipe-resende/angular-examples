import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MiddlewareConst } from 'src/app/core/constants/middleware.const';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { ApplicationMetricsService } from 'src/app/services/factories/application-metrics/application-metrics.service';
import { TotalOfCountByMiddleware } from 'src/app/shared/interfaces/total-count-by-middleware.interface';
import { MatDatepicker } from '@angular/material/datepicker';

const MIN_DATE = { year: 2023, month: 0, day: 1 };
const firstDay = 1;
const oneMonth = 1;
@Component({
  selector: 'app-application-metrics',
  templateUrl: './application-metrics.component.html',
  styleUrls: ['./application-metrics.component.scss'],
})
export class ApplicationMetricsComponent implements OnInit {
  public eventsList: TotalOfCountByMiddleware[] = [];

  public isLoading = false;

  public totalCount: number;

  public monthOfYear: string;

  public errorMessage: string;

  public date = new Date();

  public minDate = new Date(MIN_DATE.year, MIN_DATE.month, MIN_DATE.day);

  public maxDate = new Date();

  constructor(
    private applicationMetricsService: ApplicationMetricsService,
    private alertService: AlertModalService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.maxDate.setDate(firstDay);
    this.date.setDate(firstDay);
    this.maxDate.setMonth(this.date.getMonth() - oneMonth);
    this.date.setMonth(this.date.getMonth() - oneMonth);
    this.isLoading = true;
    this.setData(this.date.getFullYear(), this.date.getMonth() + oneMonth);
  }

  setMonthAndYear(
    normalizedMonthAndYear: Date,
    datepicker: MatDatepicker<Date>,
  ) {
    this.isLoading = true;
    const ctrlValue = new Date(this.date);
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.date = ctrlValue;
    datepicker.close();
    this.setData(this.date.getFullYear(), this.date.getMonth() + oneMonth);
  }

  setData(year: number, month: number): void {
    this.applicationMetricsService
      .getCountByTotalAndByMiddleware(year, month)
      .subscribe(
        (response: any) => {
          this.totalCount = response.totalCount;
          this.eventsList = this.sortByMiddlewareName(
            response.totalCountByMiddlewares,
          );
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.alertService.showAlertDanger(this.errorMessage, '');
          this.isLoading = false;
        },
      );
  }

  sortByMiddlewareName(
    events: TotalOfCountByMiddleware[],
  ): TotalOfCountByMiddleware[] {
    events.sort((a, b) => {
      if (a === b) {
        return -1;
      }
      return a.middleware.localeCompare(b.middleware);
    });
    return events;
  }

  isBusEventMiddleware(middleware: string): boolean {
    return middleware === MiddlewareConst.Onibus;
  }

  public setupTranslatedErrorMessage(): void {
    this.translate
      .get('APPLICATION_METRICS.MODAL.RESPONSE.ERROR')
      .subscribe(errorMessage => {
        this.errorMessage = errorMessage;
      });
  }
}
