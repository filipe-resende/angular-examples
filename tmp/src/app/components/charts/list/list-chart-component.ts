import { Component, Input, OnInit } from '@angular/core';
import { ChartModel } from 'src/app/model/charts/chart-model-interface';

@Component({
  selector: 'app-list-chart',
  templateUrl: './list-chart-component.html',
  styleUrls: ['./list-chart-component.scss'],
})
export class ListChartComponent implements OnInit {
  @Input()
  listData: ChartModel[] = [];

  @Input()
  periodMessage = '';

  @Input()
  message = '';

  @Input()
  selectedApplication = '';

  ngOnInit(): void {
    if (!this.periodMessage)
      this.periodMessage = 'DASHBOARD.CHARTS.PERIOD.TODAY';
  }
}
