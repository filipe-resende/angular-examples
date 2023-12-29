import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Chart, { ChartItem } from 'chart.js/auto';
import { OptionsChartScales } from 'src/app/core/constants/Charts/options-chart';
import { ChartModelIdentify } from 'src/app/model/charts/chart-modal-identify-interface';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart-component.html',
  styleUrls: ['./bar-chart-component.scss'],
})
export class BarChartComponent implements OnInit, AfterViewInit {
  @Input()
  chartColors: string[];

  @Input()
  legendLabels: string[];

  @Input()
  chartName: string;

  @Input()
  firstBar: ChartModelIdentify[];

  @Input()
  secondBar: ChartModelIdentify[];

  @Input()
  labels: string[];

  @Input()
  selectedApplication = '';

  public legend: any = [];

  public chart: ChartItem;

  public data: any = {};

  public exhibitionDataOne: number[] = [];

  public exhibitionDataTwo: number[] = [];

  ngOnInit(): void {
    this.firstBar.forEach(dataOne => {
      this.exhibitionDataOne.push(dataOne.charts.count);
    });

    this.secondBar.forEach(dataTwo => {
      this.exhibitionDataTwo.push(dataTwo.charts.count);
    });

    this.createLegendModel();
    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: this.legendLabels[0],
          backgroundColor: this.chartColors[0],
          data: this.exhibitionDataOne,
        },
        {
          label: this.legendLabels[1],
          backgroundColor: this.chartColors[1],
          data: this.exhibitionDataTwo,
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    if (this.firstBar.length || this.secondBar.length) {
      this.createChart();
    }
  }

  public createChart(): void {
    this.chart = new Chart(this.chartName, {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        scales: OptionsChartScales,
        plugins: {
          tooltip: {
            intersect: false,
            displayColors: false,
            titleColor: '#fff',
            callbacks: {
              label: context => {
                return this.getFormatedLabel(context.label, context.dataset);
              },
            },
          },
          legend: {
            display: false,
            position: 'bottom',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                family: 'Roboto',
                size: 14,
              },
              color: '#ACADAE',
              padding: 10,
            },
          },
        },
      },
    });
  }

  public getFormatedLabel(name: string, dataset: any): string {
    const textOne = this.firstBar.find(
      x => x.identify === name && x.charts.label === dataset.label,
    );

    const textTwo = this.secondBar.find(
      x => x.identify === name && x.charts.label === dataset.label,
    );

    if (textOne)
      return `${textOne.charts.count} | ${textOne.charts.percentage}`;

    if (textTwo)
      return `${textTwo.charts.count} | ${textTwo.charts.percentage}`;

    return null;
  }

  public createLegendModel(): void {
    for (let i = 0; i < 2; i += 1) {
      this.legend.push({
        color: this.chartColors[i],
        label: this.legendLabels[i],
      });
    }
  }
}
