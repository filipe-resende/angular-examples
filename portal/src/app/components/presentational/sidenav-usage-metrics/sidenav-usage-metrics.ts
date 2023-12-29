import { Component } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { UsageMetricsService } from '../../../core/services/usage-metrics.service';
import { UsageMetrics } from '../../../shared/models/usageMetrics';
import { UsageMetricsItem } from '../../../shared/models/usageMetricsItem';

const MIN_DATE = { year: 2023, month: 0, day: 1 };
const firstDay = 1;
const oneMonth = 1;
@Component({
  selector: 'app-sidenav-usage-metrics',
  templateUrl: 'sidenav-usage-metrics.html',
  styleUrls: ['sidenav-usage-metrics.scss']
})
export class SideNavUsageMetricsComponent {
  public isLoading = false;

  public hasSelectedDate = false;

  public minDate = new Date(MIN_DATE.year, MIN_DATE.month, MIN_DATE.day);

  public maxDate = new Date();

  public date: Date;

  public usageMetrics: UsageMetricsItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<SideNavUsageMetricsComponent>,
    private usageMetricsService: UsageMetricsService
  ) {}

  public closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.maxDate.setDate(firstDay);
    this.maxDate.setMonth(this.maxDate.getMonth() - oneMonth);

    this.getUsageMetricsDataArray();
  }

  public setMonthAndYear(
    normalizedMonthAndYear: Date,
    datepicker: MatDatepicker<Date>
  ): void {
    this.isLoading = true;
    this.hasSelectedDate = true;
    this.date = new Date(this.maxDate);
    this.date.setMonth(normalizedMonthAndYear.getMonth());
    this.date.setFullYear(normalizedMonthAndYear.getFullYear());
    datepicker.close();
    this.getUsageMetricsDataArray(
      this.date.getMonth(),
      this.date.getFullYear()
    );
  }

  private getUsageMetricsDataArray(month?: number, year?: number): void {
    let realMonth;

    if (month != null) {
      realMonth = month + 1;
    }
    this.usageMetrics = [];
    this.usageMetricsService
      .GetUsageMetrics(realMonth, year)
      .subscribe((response: UsageMetrics[]) => {
        response.forEach(metric => {
          this.usageMetrics.push(this.usageMetricToUsageMetricItem(metric));
        });
        this.isLoading = false;
      });
  }

  public resetDataToDefault(): void {
    this.isLoading = true;
    this.hasSelectedDate = false;
    this.date = null;
    this.getUsageMetricsDataArray();
  }

  private formatUsageMetricsID(usageMetricsId: string): string {
    const date = new Date();
    date.setDate(firstDay);
    const UsageMetricsId = usageMetricsId.split('-');
    const year = UsageMetricsId[0];
    date.setMonth(Number(UsageMetricsId[1]) - oneMonth);
    let month = date.toLocaleString('default', { month: 'long' });
    month = month.charAt(0).toUpperCase() + month.slice(1);

    return `${month} ${year}`;
  }

  private usageMetricToUsageMetricItem(
    usageMetric: UsageMetrics
  ): UsageMetricsItem {
    const usageMetricsItem: UsageMetricsItem = {
      id: usageMetric.id,
      totalAccess: usageMetric.totalAccess,
      totalDistinctUsers: usageMetric.totalDistinctUsers,
      name: this.formatUsageMetricsID(usageMetric.id)
    };
    return usageMetricsItem;
  }
}
