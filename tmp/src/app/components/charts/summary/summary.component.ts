import { Component, Input } from '@angular/core';
import { ChartSummary } from 'src/app/model/charts/summary-interfaces/chart-summary-interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  @Input()
  summaryData: ChartSummary;
}
